import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserService } from '../common/current-user';

@Controller('goals')
export class GoalsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currentUser: CurrentUserService,
  ) {}

  @Get()
  async findAll() {
    const userId = await this.currentUser.getId();
    return this.prisma.goal.findMany({
      where: { userId },
      orderBy: [{ priority: 'desc' }, { name: 'asc' }],
    });
  }
}
