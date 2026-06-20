import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkspaceRole } from '@prisma/client';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { Roles } from '../../common/roles.decorator';
import { WorkspaceRoleGuard } from '../../common/workspace-role.guard';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@ApiTags('API Keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get(':workspaceId')
  @ApiOperation({ summary: 'List API keys for a workspace' })
  list(
    @CurrentUser() user: { sub: string; email: string },
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.apiKeysService.list(user.sub, workspaceId);
  }

  @Post()
  @UseGuards(WorkspaceRoleGuard)
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  @ApiOperation({ summary: 'Create a new API key for a workspace' })
  create(
    @CurrentUser() user: { sub: string; email: string },
    @Body() body: CreateApiKeyDto,
  ) {
    return this.apiKeysService.create(user.sub, body);
  }

  @Delete(':workspaceId/:keyId')
  @UseGuards(WorkspaceRoleGuard)
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  @ApiOperation({ summary: 'Revoke an existing API key' })
  revoke(
    @CurrentUser() user: { sub: string; email: string },
    @Param('workspaceId') workspaceId: string,
    @Param('keyId') keyId: string,
  ) {
    return this.apiKeysService.revoke(user.sub, workspaceId, keyId);
  }
}
