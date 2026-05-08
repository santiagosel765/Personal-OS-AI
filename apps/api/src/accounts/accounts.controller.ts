import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserService } from '../common/current-user';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currentUser: CurrentUserService,
  ) {}

  @Get()
  async findAll() {
    const userId = await this.currentUser.getId();
    return this.prisma.account.findMany({
      where: { userId, isActive: true },
      orderBy: [{ isReserved: 'asc' }, { name: 'asc' }],
    });
  }
}
