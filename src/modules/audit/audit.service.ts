import { ForbiddenException, Injectable } from '@nestjs/common';
import { WorkspaceRole } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async listWorkspaceLogs(userId: string, workspaceId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, workspaceId },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this workspace');
    }

    const logs = await this.prisma.auditLog.findMany({
      where: { workspaceId },
      include: {
        actorUser: {
          select: { id: true, email: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      workspaceId,
      viewerRole: membership.role,
      entries: logs.map((log) => ({
        id: log.id,
        actorType: log.actorType,
        actorUser: log.actorUser,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        ipAddress: log.ipAddress,
        metadata: log.metadata,
        createdAt: log.createdAt,
      })),
    };
  }

  async assertAuditAdmin(userId: string, workspaceId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, workspaceId },
    });

    const allowedRoles: WorkspaceRole[] = [
      WorkspaceRole.OWNER,
      WorkspaceRole.ADMIN,
      WorkspaceRole.BILLING_MANAGER,
    ];

    if (!membership || !allowedRoles.includes(membership.role)) {
      throw new ForbiddenException('You do not have permission to view audit logs');
    }

    return membership;
  }
}
