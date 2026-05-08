import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserService } from '../common/current-user';

@Controller('cards')
export class CardsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currentUser: CurrentUserService,
  ) {}

  @Get()
  async findAll() {
    const userId = await this.currentUser.getId();
    return this.prisma.card.findMany({
      where: { userId },
      orderBy: [{ status: 'asc' }, { name: 'asc' }],
    });
  }
}
