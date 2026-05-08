import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserService } from '../common/current-user';

@Controller('debts')
export class DebtsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currentUser: CurrentUserService,
  ) {}

  @Get()
  async findAll() {
    const userId = await this.currentUser.getId();
    return this.prisma.debt.findMany({
      where: { userId },
      orderBy: [{ status: 'asc' }, { currentBalance: 'desc' }],
    });
  }
}
