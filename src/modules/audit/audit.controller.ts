import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkspaceRole } from '@prisma/client';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { Roles } from '../../common/roles.decorator';
import { WorkspaceRoleGuard } from '../../common/workspace-role.guard';
import { AuditService } from './audit.service';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get(':workspaceId/logs')
  @UseGuards(WorkspaceRoleGuard)
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.BILLING_MANAGER)
  @ApiOperation({ summary: 'List auditable security, billing, and API key events' })
  logs(
    @CurrentUser() user: { sub: string; email: string },
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.auditService.listWorkspaceLogs(user.sub, workspaceId);
  }
}
