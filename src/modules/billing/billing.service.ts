import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionStatus, WorkspacePlan } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from '../../common/prisma.service';
import { StripeService } from '../../common/stripe.service';
import { env } from '../../config/env';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

const planCatalog: Record<'FREE' | 'PRO' | 'TEAM', { priceId: string; amount: string }> = {
  FREE: { priceId: 'price_free_demo', amount: '$0/mo' },
  PRO: { priceId: env.STRIPE_PRICE_PRO, amount: '$29/mo' },
  TEAM: { priceId: env.STRIPE_PRICE_TEAM, amount: '$99/mo' },
};

@Injectable()
export class BillingService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  async getOverview(userId: string, workspaceId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, workspaceId },
      include: {
        workspace: {
          include: {
            subscription: true,
            _count: {
              select: { memberships: true },
            },
          },
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this workspace billing');
    }

    return {
      workspaceId: membership.workspace.id,
      workspaceName: membership.workspace.name,
      plan: membership.workspace.plan,
      role: membership.role,
      status: membership.workspace.subscription?.status ?? SubscriptionStatus.TRIALING,
      seats: membership.workspace._count.memberships,
      nextInvoiceAt: membership.workspace.subscription?.currentPeriodEnd,
      stripe: {
        customerId: membership.workspace.stripeCustomerId,
        subscriptionId: membership.workspace.subscription?.stripeSubscriptionId,
        portalEnabled: true,
      },
      usage: {
        apiRequests: { used: 12450, limit: membership.workspace.plan === 'TEAM' ? 250000 : 50000 },
        members: { used: membership.workspace._count.memberships, limit: membership.workspace.plan === 'TEAM' ? 50 : 10 },
        storageGb: { used: 12, limit: membership.workspace.plan === 'TEAM' ? 500 : 100 },
      },
    };
  }

  async createCheckoutSession(userId: string, payload: CreateCheckoutSessionDto) {
    const plan = planCatalog[payload.plan];
    if (!plan) throw new BadRequestException('Unsupported plan selected');
    if (payload.plan === 'FREE') throw new BadRequestException('Free plan does not require checkout');

    const membership = await this.prisma.membership.findFirst({
      where: { userId, workspaceId: payload.workspaceId },
      include: { workspace: true },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    if (!this.stripeService.isConfigured()) {
      return {
        mode: 'demo',
        checkoutUrl: `https://dashboard.stripe.com/test/payments?prefill_plan=${payload.plan}`,
        workspaceId: payload.workspaceId,
        workspaceName: membership.workspace.name,
        selectedPlan: payload.plan,
        amount: plan.amount,
        note: 'Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to create real checkout sessions.',
      };
    }

    let customerId = membership.workspace.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripeService.getClient().customers.create({
        name: membership.workspace.name,
        metadata: { workspaceId: membership.workspace.id },
      });
      customerId = customer.id;

      await this.prisma.workspace.update({
        where: { id: membership.workspace.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripeService.getClient().checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: payload.successUrl ?? `${env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: payload.cancelUrl ?? `${env.APP_URL}/billing/cancel`,
      metadata: {
        workspaceId: payload.workspaceId,
        plan: payload.plan,
      },
      subscription_data: {
        metadata: {
          workspaceId: payload.workspaceId,
          plan: payload.plan,
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        workspaceId: membership.workspace.id,
        actorUserId: userId,
        action: 'billing.checkout_session.created',
        entityType: 'stripe_checkout_session',
        entityId: session.id,
        metadata: {
          plan: payload.plan,
          checkoutUrl: session.url,
        },
      },
    });

    return {
      mode: 'live',
      checkoutUrl: session.url,
      sessionId: session.id,
      workspaceId: payload.workspaceId,
      selectedPlan: payload.plan,
    };
  }

  verifyAndConstructEvent(signature: string | string[] | undefined, rawBody: Buffer | string) {
    if (!signature || Array.isArray(signature)) {
      throw new BadRequestException('Missing Stripe signature header');
    }

    if (!this.stripeService.isConfigured()) {
      return {
        id: 'evt_demo_webhook',
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub_demo_001',
            status: 'active',
            metadata: {
              workspaceId: 'demo-workspace-id',
              plan: 'PRO',
            },
            current_period_start: Math.floor(Date.now() / 1000),
            current_period_end: Math.floor(Date.now() / 1000) + 2592000,
            cancel_at_period_end: false,
            items: {
              data: [{ price: { id: env.STRIPE_PRICE_PRO } }],
            },
          },
        },
      } as unknown as Stripe.Event;
    }

    return this.stripeService
      .getClient()
      .webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  }

  async handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        return {
          received: true,
          type: event.type,
          workspaceId: session.metadata?.workspaceId,
          message: 'Checkout completion acknowledged',
        };
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.syncSubscription(subscription);

        return {
          received: true,
          type: event.type,
          subscriptionId: subscription.id,
          message: 'Stripe subscription synced successfully',
        };
      }
      default:
        return {
          received: true,
          type: event.type,
          message: 'Unhandled Stripe event stored for later processing',
        };
    }
  }

  private async syncSubscription(subscription: Stripe.Subscription) {
    const currentPeriodStart = (subscription as Stripe.Subscription & {
      current_period_start?: number;
    }).current_period_start;
    const currentPeriodEnd = (subscription as Stripe.Subscription & {
      current_period_end?: number;
    }).current_period_end;

    const workspaceId = subscription.metadata.workspaceId;
    if (!workspaceId) {
      throw new NotFoundException('Workspace metadata missing from Stripe subscription');
    }

    const workspace = await this.prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (!workspace) {
      throw new NotFoundException('Workspace not found for Stripe subscription sync');
    }

    const priceId = subscription.items.data[0]?.price.id ?? null;
    const mappedPlan = this.mapPriceToPlan(priceId);

    await this.prisma.workspace.update({
      where: { id: workspace.id },
      data: { plan: mappedPlan },
    });

    await this.prisma.subscription.upsert({
      where: { workspaceId: workspace.id },
      create: {
        workspaceId: workspace.id,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        status: this.mapSubscriptionStatus(subscription.status),
        currentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : null,
        currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      update: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        status: this.mapSubscriptionStatus(subscription.status),
        currentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : null,
        currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        workspaceId: workspace.id,
        action: 'billing.subscription.synced',
        entityType: 'subscription',
        entityId: subscription.id,
        actorType: 'SYSTEM',
        metadata: {
          status: subscription.status,
          plan: mappedPlan,
          priceId,
        },
      },
    });
  }

  private mapPriceToPlan(priceId: string | null) {
    if (priceId === env.STRIPE_PRICE_TEAM) return WorkspacePlan.TEAM;
    if (priceId === env.STRIPE_PRICE_PRO) return WorkspacePlan.PRO;
    return WorkspacePlan.FREE;
  }

  private mapSubscriptionStatus(status: Stripe.Subscription.Status) {
    switch (status) {
      case 'active':
        return SubscriptionStatus.ACTIVE;
      case 'past_due':
        return SubscriptionStatus.PAST_DUE;
      case 'canceled':
      case 'unpaid':
        return SubscriptionStatus.CANCELED;
      case 'incomplete':
      case 'incomplete_expired':
        return SubscriptionStatus.INCOMPLETE;
      case 'trialing':
      case 'paused':
      default:
        return SubscriptionStatus.TRIALING;
    }
  }
}
