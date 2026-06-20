import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { WorkspacesService } from './workspaces.service';

@ApiTags('Workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  @ApiOperation({ summary: 'List workspaces accessible to the authenticated user' })
  list(@CurrentUser() user: { sub: string; email: string }) {
    return this.workspacesService.listForUser(user.sub);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get workspace details, subscription, and members' })
  detail(
    @CurrentUser() user: { sub: string; email: string },
    @Param('slug') slug: string,
  ) {
    return this.workspacesService.getWorkspaceBySlug(user.sub, slug);
  }
}
