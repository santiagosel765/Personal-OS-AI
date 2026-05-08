import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserService } from '../common/current-user';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currentUser: CurrentUserService,
  ) {}

  @Get()
  async findAll(@Query('limit') limit?: string) {
    const userId = await this.currentUser.getId();
    const take = Math.min(Number(limit ?? 100) || 100, 500);
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take,
      include: {
        account: { select: { id: true, name: true, bank: true } },
        accountTo: { select: { id: true, name: true, bank: true } },
        category: { select: { id: true, name: true, type: true } },
      },
    });
  }
}
