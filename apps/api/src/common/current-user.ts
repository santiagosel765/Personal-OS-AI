import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Fase 2: usuario único hardcodeado al seed (selvin@example.com).
 * Cuando llegue auth real, este servicio será reemplazado por el JWT subject.
 */
@Injectable()
export class CurrentUserService {
  constructor(private readonly prisma: PrismaService) {}

  private cachedId: string | null = null;

  async getId(): Promise<string> {
    if (this.cachedId) return this.cachedId;
    const user = await this.prisma.user.findUnique({
      where: { email: 'selvin@example.com' },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException(
        'No hay usuario demo. Corre `pnpm db:seed` antes de levantar el API.',
      );
    }
    this.cachedId = user.id;
    return user.id;
  }
}
