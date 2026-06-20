import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkspaceRole } from '@prisma/client';
import { generateApiKey, maskApiKey } from '../../common/api-key.util';
import { PrismaService } from '../../common/prisma.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, workspaceId: string) {
    await this.assertWorkspaceMembership(userId, workspaceId);

    const keys = await this.prisma.apiKey.findMany({
      where: { workspaceId },
      include: {
        createdBy: {
          select: { id: true, email: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return keys.map((key) => ({
      id: key.id,
      name: key.name,
      keyPreview: maskApiKey(key.prefix),
      createdBy: key.createdBy,
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
      revokedAt: key.revokedAt,
      status: key.revokedAt ? 'revoked' : 'active',
    }));
  }

  async create(userId: string, payload: CreateApiKeyDto) {
    await this.assertWorkspaceRole(userId, payload.workspaceId, [
      WorkspaceRole.OWNER,
      WorkspaceRole.ADMIN,
    ]);

    const generated = generateApiKey();
    const record = await this.prisma.apiKey.create({
      data: {
        workspaceId: payload.workspaceId,
        createdById: userId,
        name: payload.name,
        prefix: generated.prefix,
        secretHash: generated.secretHash,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        workspaceId: payload.workspaceId,
        actorUserId: userId,
        action: 'api_key.created',
        entityType: 'api_key',
        entityId: record.id,
        metadata: {
          name: payload.name,
          prefix: generated.prefix,
        },
      },
    });

    return {
      message: 'API key created successfully',
      apiKey: {
        id: record.id,
        name: record.name,
        prefix: record.prefix,
        token: generated.token,
        createdAt: record.createdAt,
        note: 'Store this token now. It will not be shown again.',
      },
    };
  }

  async revoke(userId: string, workspaceId: string, keyId: string) {
    await this.assertWorkspaceRole(userId, workspaceId, [
      WorkspaceRole.OWNER,
      WorkspaceRole.ADMIN,
    ]);

    const key = await this.prisma.apiKey.findFirst({
      where: { id: keyId, workspaceId },
    });

    if (!key) {
      throw new NotFoundException('API key not found');
    }

    const revoked = await this.prisma.apiKey.update({
      where: { id: key.id },
      data: { revokedAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        workspaceId,
        actorUserId: userId,
        action: 'api_key.revoked',
        entityType: 'api_key',
        entityId: revoked.id,
        metadata: {
          name: revoked.name,
          prefix: revoked.prefix,
        },
      },
    });

    return {
      message: 'API key revoked successfully',
      apiKey: {
        id: revoked.id,
        name: revoked.name,
        revokedAt: revoked.revokedAt,
      },
    };
  }

  private async assertWorkspaceMembership(userId: string, workspaceId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, workspaceId },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this workspace');
    }

    return membership;
  }

  private async assertWorkspaceRole(
    userId: string,
    workspaceId: string,
    roles: WorkspaceRole[],
  ) {
    const membership = await this.assertWorkspaceMembership(userId, workspaceId);
    if (!roles.includes(membership.role)) {
      throw new ForbiddenException('Insufficient workspace permissions');
    }
    return membership;
  }
}
