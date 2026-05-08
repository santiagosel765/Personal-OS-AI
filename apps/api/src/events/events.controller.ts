import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserService } from '../common/current-user';

@Controller('events')
export class EventsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currentUser: CurrentUserService,
  ) {}

  @Get()
  async findAll() {
    const userId = await this.currentUser.getId();
    return this.prisma.event.findMany({
      where: { userId },
      orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
    });
  }
}
