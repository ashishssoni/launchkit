import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            subscription: true,
            _count: {
              select: {
                memberships: true,
                apiKeys: true,
                auditLogs: true,
              },
            },
          },
        },
      },
      orderBy: {
        workspace: { createdAt: 'desc' },
      },
    });

    return memberships.map((membership) => ({
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      role: membership.role,
      plan: membership.workspace.plan,
      membersCount: membership.workspace._count.memberships,
      apiKeysCount: membership.workspace._count.apiKeys,
      auditEventsCount: membership.workspace._count.auditLogs,
      billingStatus: membership.workspace.subscription?.status ?? 'TRIALING',
    }));
  }

  async getWorkspaceBySlug(userId: string, slug: string) {
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        workspace: { slug },
      },
      include: {
        workspace: {
          include: {
            subscription: true,
            memberships: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!membership) {
      const exists = await this.prisma.workspace.findUnique({ where: { slug } });
      if (exists) {
        throw new ForbiddenException('You do not have access to this workspace');
      }
      throw new NotFoundException('Workspace not found');
    }

    return {
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      plan: membership.workspace.plan,
      role: membership.role,
      subscription: membership.workspace.subscription,
      members: membership.workspace.memberships.map((item) => ({
        id: item.user.id,
        email: item.user.email,
        fullName: item.user.fullName,
        role: item.role,
      })),
    };
  }
}
