import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { BillingModule } from './modules/billing/billing.module';
import { AuditModule } from './modules/audit/audit.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    WorkspacesModule,
    BillingModule,
    AuditModule,
    ApiKeysModule,
  ],
})
export class AppModule {}
