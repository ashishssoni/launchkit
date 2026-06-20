import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':workspaceId/feed')
  @ApiOperation({ summary: 'List recent workspace product and billing events' })
  feed(
    @CurrentUser() user: { sub: string; email: string },
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.notificationsService.feed(user.sub, workspaceId);
  }
}
