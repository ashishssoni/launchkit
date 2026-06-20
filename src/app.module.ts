import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';

@Module({
  imports: [PrismaModule, HealthModule, AuthModule, WorkspacesModule],
})
export class AppModule {}
