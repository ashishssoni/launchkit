import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async feed(userId: string, workspaceId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, workspaceId },
      include: { workspace: true },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this workspace');
    }

    const logs = await this.prisma.auditLog.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      workspace: {
        id: membership.workspace.id,
        name: membership.workspace.name,
        slug: membership.workspace.slug,
      },
      feed: logs.map((log) => ({
        id: log.id,
        type: log.action,
        title: this.toHumanTitle(log.action),
        createdAt: log.createdAt,
        metadata: log.metadata,
      })),
    };
  }

  private toHumanTitle(action: string) {
    return action
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
