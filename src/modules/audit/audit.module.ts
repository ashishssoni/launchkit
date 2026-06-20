import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WorkspaceRoleGuard } from '../../common/workspace-role.guard';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuditController],
  providers: [AuditService, WorkspaceRoleGuard],
})
export class AuditModule {}
