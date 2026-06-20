import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { StripeService } from '../../common/stripe.service';

@Module({
  controllers: [BillingController],
  providers: [BillingService, StripeService],
})
export class BillingModule {}
