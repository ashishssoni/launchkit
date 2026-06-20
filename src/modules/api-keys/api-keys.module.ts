import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysService } from './api-keys.service';
import { WorkspaceRoleGuard } from '../../common/workspace-role.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ApiKeysController],
  providers: [ApiKeysService, WorkspaceRoleGuard],
})
export class ApiKeysModule {}
