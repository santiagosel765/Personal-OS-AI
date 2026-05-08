/**
 * Seed inicial — datos reales de Selvin Santiago.
 * Idempotente: borra y recrea el usuario demo y todo lo asociado.
 */
import {
  PrismaClient,
  AccountType,
  CardStatus,
  DebtStatus,
  GoalStatus,
  GoalPriority,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Personal OS dev DB…');

  // Idempotencia: borra el user demo y todo lo dependiente cae por cascade.
  await prisma.user.deleteMany({ where: { email: 'selvin@example.com' } });

  const user = await prisma.user.create({
    data: {
      name: 'Selvin Santiago',
      email: 'selvin@example.com',
      currency: 'GTQ',
      timezone: 'America/Guatemala',
      monthlyIncome: 18800,
      weeklyBudget: 1000,
    },
  });
  console.log(`  user → ${user.email} (${user.id})`);

  // ─── Accounts ───
  await prisma.account.createMany({
    data: [
      {
        userId: user.id,
        name: 'BI',
        bank: 'Banco Industrial',
        type: AccountType.CHECKING,
        initialBalance: 1700,
        currentBalance: 1700,
        purpose: 'Uso diario',
        isReserved: false,
      },
      {
        userId: user.id,
        name: 'BAC',
        bank: 'BAC Credomatic',
        type: AccountType.CHECKING,
        initialBalance: 1000,
        currentBalance: 1000,
        purpose: 'Pagos AMEX y servicios',
        isReserved: false,
      },
      {
        userId: user.id,
        name: 'Reservado BAM Oro',
        bank: 'BAM',
        type: AccountType.SAVINGS,
        initialBalance: 4300,
        currentBalance: 4300,
        purpose: 'Cubrir financiamientos pendientes en BAM Oro',
        isReserved: true,
      },
      {
        userId: user.id,
        name: 'Fondo de emergencia',
        type: AccountType.EMERGENCY,
        initialBalance: 0,
        currentBalance: 0,
        purpose: 'Meta Q25,000',
        isReserved: false,
      },
      {
        userId: user.id,
        name: 'Efectivo',
        type: AccountType.CASH,
        initialBalance: 0,
        currentBalance: 0,
        isReserved: false,
      },
    ],
  });

  // ─── Debts ───
  await prisma.debt.createMany({
    data: [
      {
        userId: user.id,
        institution: 'BAC Credomatic',
        name: 'Préstamo casa',
        type: 'mortgage',
        initialAmount: 21845.88,
        currentBalance: 21845.88,
        interestRate: 16,
        monthlyPayment: 863.5,
        status: DebtStatus.ACTIVE,
      },
      {
        userId: user.id,
        institution: 'BAM',
        name: 'Préstamo Toyota Tacoma',
        type: 'auto',
        initialAmount: 38906.63,
        currentBalance: 38906.63,
        interestRate: 24,
        monthlyPayment: 2600,
        status: DebtStatus.ACTIVE,
      },
      {
        userId: user.id,
        institution: 'Promerica',
        name: 'Financiamiento actual Promerica',
        type: 'card_financing',
        initialAmount: 18269.78,
        currentBalance: 18269.78,
        interestRate: 0,
        monthlyPayment: 652.49,
        status: DebtStatus.ACTIVE,
      },
      {
        userId: user.id,
        institution: 'BAM',
        name: 'Financiamiento BAM Blanca',
        type: 'card_financing',
        initialAmount: 4027.77,
        currentBalance: 4027.77,
        interestRate: 0,
        monthlyPayment: 138.89,
        status: DebtStatus.ACTIVE,
      },
      {
        userId: user.id,
        institution: 'Promerica',
        name: 'Financiamiento extra Promerica',
        type: 'card_financing',
        initialAmount: 19600,
        currentBalance: 19600,
        interestRate: 0,
        monthlyPayment: 1347.08,
        allowsCapitalPayment: true,
        capitalPaymentFrom: 4,
        status: DebtStatus.ACTIVE,
      },
    ],
  });

  // ─── Cards ───
  await prisma.card.createMany({
    data: [
      {
        userId: user.id,
        bank: 'Promerica',
        name: 'Promerica',
        status: CardStatus.BLOCKED,
        currentBalance: 0,
        actionRequired: 'No usar — bloqueada',
      },
      {
        userId: user.id,
        bank: 'BAM',
        name: 'BAM Oro',
        status: CardStatus.PENDING_CANCELLATION,
        currentBalance: 0,
        principalBalance: 0,
        revolvingBalance: 0,
        actionRequired: 'Cancelar — pendiente Q4,300 en financiamientos',
        notes: 'Saldo principal Q0; financiamientos pendientes cubiertos por cuenta reservada',
      },
      {
        userId: user.id,
        bank: 'BAM',
        name: 'BAM Blanca',
        status: CardStatus.ACTIVE,
        currentBalance: 1720.74,
      },
      {
        userId: user.id,
        bank: 'BAC Credomatic',
        name: 'AMEX BAC',
        status: CardStatus.ACTIVE,
        currentBalance: 8750,
      },
    ],
  });

  // ─── Goals ───
  await prisma.goal.createMany({
    data: [
      {
        userId: user.id,
        name: 'Cancelar BAM Oro',
        category: 'debt',
        targetAmount: 4300,
        currentAmount: 4300,
        priority: GoalPriority.HIGH,
        status: GoalStatus.ACTIVE,
        notes: 'Reserva ya separada en cuenta reservada BAM Oro',
      },
      {
        userId: user.id,
        name: 'AMEX en cero',
        category: 'debt',
        targetAmount: 8750,
        currentAmount: 0,
        priority: GoalPriority.HIGH,
        status: GoalStatus.ACTIVE,
      },
      {
        userId: user.id,
        name: 'Fondo de emergencia',
        category: 'savings',
        targetAmount: 25000,
        currentAmount: 0,
        priority: GoalPriority.CRITICAL,
        status: GoalStatus.ACTIVE,
      },
      {
        userId: user.id,
        name: 'Comprar Garmin Forerunner 265',
        category: 'purchase',
        targetAmount: 4500,
        currentAmount: 0,
        priority: GoalPriority.MEDIUM,
        status: GoalStatus.ACTIVE,
      },
      {
        userId: user.id,
        name: 'Irme a vivir solo',
        category: 'lifestyle',
        targetAmount: 0,
        currentAmount: 0,
        priority: GoalPriority.MEDIUM,
        status: GoalStatus.ACTIVE,
        notes: 'Pendiente definir target',
      },
      {
        userId: user.id,
        name: 'Salud Contigo',
        category: 'health',
        targetAmount: 0,
        currentAmount: 0,
        priority: GoalPriority.MEDIUM,
        status: GoalStatus.ACTIVE,
      },
      {
        userId: user.id,
        name: 'Formalizar empresa con amigos',
        category: 'business',
        targetAmount: 0,
        currentAmount: 0,
        priority: GoalPriority.MEDIUM,
        status: GoalStatus.ACTIVE,
      },
      {
        userId: user.id,
        name: 'Evaluar Toyota Tacoma',
        category: 'review',
        targetAmount: 0,
        currentAmount: 0,
        priority: GoalPriority.LOW,
        status: GoalStatus.ACTIVE,
        notes: 'Decidir si conviene mantener el préstamo',
      },
    ],
  });

  // ─── Event log inicial ───
  await prisma.eventLog.create({
    data: {
      userId: user.id,
      eventType: 'seed.completed',
      entityType: 'system',
      payload: { source: 'prisma/seed.ts', date: new Date().toISOString() },
    },
  });

  const summary = await Promise.all([
    prisma.account.count({ where: { userId: user.id } }),
    prisma.debt.count({ where: { userId: user.id } }),
    prisma.card.count({ where: { userId: user.id } }),
    prisma.goal.count({ where: { userId: user.id } }),
  ]);
  console.log(`  accounts=${summary[0]} debts=${summary[1]} cards=${summary[2]} goals=${summary[3]}`);
  console.log('✅ Seed completo.');
}

main()
  .catch((err) => {
    console.error('❌ Seed falló:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
