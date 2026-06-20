import { Body, Controller, Get, Headers, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { CurrentUser } from '../../common/current-user.decorator';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('overview/:workspaceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Stripe subscription overview for a workspace' })
  overview(
    @CurrentUser() user: { sub: string; email: string },
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.billingService.getOverview(user.sub, workspaceId);
  }

  @Post('checkout-session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Stripe Checkout session for workspace billing' })
  createCheckoutSession(
    @CurrentUser() user: { sub: string; email: string },
    @Body() body: CreateCheckoutSessionDto,
  ) {
    return this.billingService.createCheckoutSession(user.sub, body);
  }

  @Post('webhooks/stripe')
  @HttpCode(200)
  @ApiOperation({ summary: 'Receive Stripe webhook events for subscription syncing' })
  @ApiBody({
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  async handleStripeWebhook(
    @Headers('stripe-signature') stripeSignature: string | string[] | undefined,
    @Req() request: FastifyRequest & { rawBody?: Buffer },
  ) {
    const rawBody = request.rawBody ?? JSON.stringify(request.body ?? {});
    const event = this.billingService.verifyAndConstructEvent(stripeSignature, rawBody);

    return this.billingService.handleWebhookEvent(event);
  }
}
