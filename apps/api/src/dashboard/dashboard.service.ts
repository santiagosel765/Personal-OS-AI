import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserService } from '../common/current-user';

const ZERO = new Prisma.Decimal(0);

function startOfWeek(now: Date): Date {
  // Lunes 00:00 hora local del servidor (suficiente para Fase 2; cuando llegue auth real,
  // usaremos user.timezone explícitamente).
  const d = new Date(now);
  const day = d.getDay(); // 0 dom .. 6 sáb
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currentUser: CurrentUserService,
  ) {}

  async getDashboard() {
    const userId = await this.currentUser.getId();

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { monthlyIncome: true, weeklyBudget: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const [accounts, debts, cards, goals] = await Promise.all([
      this.prisma.account.findMany({
        where: { userId, isActive: true },
        orderBy: [{ isReserved: 'asc' }, { name: 'asc' }],
      }),
      this.prisma.debt.findMany({
        where: { userId },
        orderBy: [{ status: 'asc' }, { currentBalance: 'desc' }],
      }),
      this.prisma.card.findMany({
        where: { userId },
        orderBy: [{ status: 'asc' }, { name: 'asc' }],
      }),
      this.prisma.goal.findMany({
        where: { userId, status: 'ACTIVE' },
        orderBy: [{ priority: 'desc' }, { name: 'asc' }],
      }),
    ]);

    const availableReal = accounts
      .filter((a) => !a.isReserved)
      .reduce<Prisma.Decimal>((acc, a) => acc.add(a.currentBalance), ZERO);
    const reserved = accounts
      .filter((a) => a.isReserved)
      .reduce<Prisma.Decimal>((acc, a) => acc.add(a.currentBalance), ZERO);
    const monthlyDebt = debts
      .filter((d) => d.status === 'ACTIVE')
      .reduce<Prisma.Decimal>((acc, d) => acc.add(d.monthlyPayment), ZERO);

    // Gasto semanal: transacciones EXPENSE de la semana en curso.
    const weekStart = startOfWeek(new Date());
    const weeklyAgg = await this.prisma.transaction.aggregate({
      where: { userId, type: 'EXPENSE', date: { gte: weekStart } },
      _sum: { amount: true },
    });
    const weeklySpent = weeklyAgg._sum.amount ?? ZERO;

    const cardsCritical = cards.filter((c) => {
      if (c.status === 'BLOCKED' || c.status === 'PENDING_CANCELLATION') return true;
      if (c.creditLimit && c.currentBalance) {
        const ratio = Number(c.currentBalance) / Number(c.creditLimit);
        if (ratio >= 0.8) return true;
      }
      return false;
    });

    const alerts = this.buildAlerts({
      cardsCritical,
      monthlyDebt,
      availableReal,
      weeklyBudget: user.weeklyBudget,
      weeklySpent,
    });

    return {
      availableReal: availableReal.toFixed(2),
      reserved: reserved.toFixed(2),
      monthlyDebt: monthlyDebt.toFixed(2),
      nextIncome: user.monthlyIncome.toFixed(2),
      weeklyBudget: user.weeklyBudget.toFixed(2),
      weeklySpent: weeklySpent.toFixed(2),
      cardsCritical,
      accounts,
      debts,
      goals,
      alerts,
    };
  }

  private buildAlerts(args: {
    cardsCritical: Array<{ id: string; name: string; status: string; actionRequired: string | null }>;
    monthlyDebt: Prisma.Decimal;
    availableReal: Prisma.Decimal;
    weeklyBudget: Prisma.Decimal;
    weeklySpent: Prisma.Decimal;
  }) {
    const alerts: Array<{ id: string; level: 'info' | 'warning' | 'critical'; message: string }> = [];

    for (const c of args.cardsCritical) {
      if (c.status === 'BLOCKED') {
        alerts.push({
          id: `card:${c.id}:blocked`,
          level: 'critical',
          message: `Tarjeta ${c.name} bloqueada — no usar.`,
        });
      } else if (c.status === 'PENDING_CANCELLATION') {
        alerts.push({
          id: `card:${c.id}:pending`,
          level: 'warning',
          message: c.actionRequired ?? `Tarjeta ${c.name} pendiente de cancelación.`,
        });
      }
    }

    if (args.weeklyBudget.gt(0) && args.weeklySpent.gt(args.weeklyBudget)) {
      alerts.push({
        id: 'weekly-over-budget',
        level: 'warning',
        message: `Te pasaste del presupuesto semanal (gastado Q${args.weeklySpent.toFixed(2)} de Q${args.weeklyBudget.toFixed(2)}).`,
      });
    }

    if (args.monthlyDebt.gt(args.availableReal)) {
      alerts.push({
        id: 'debt-exceeds-available',
        level: 'critical',
        message: `Cuota mensual de deudas (Q${args.monthlyDebt.toFixed(2)}) supera tu disponible real (Q${args.availableReal.toFixed(2)}).`,
      });
    }

    return alerts;
  }
}
