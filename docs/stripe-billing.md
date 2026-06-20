# Stripe Billing Flow

## Client-facing value

LaunchKit includes a billing foundation designed to look like a real SaaS revenue system:

- subscription plans
- Stripe Checkout session creation
- webhook endpoint for billing sync
- workspace-linked subscription metadata
- billing overview endpoint for dashboards

## Current flow

1. A workspace selects a plan
2. `POST /api/billing/checkout-session` creates a Stripe Checkout session
3. Stripe sends events to `POST /api/billing/webhooks/stripe`
4. Subscription events are acknowledged and prepared for sync logic
5. Billing overview is exposed via `GET /api/billing/overview`

## Demo mode

If Stripe keys are not configured, LaunchKit returns a demo checkout URL so the portfolio flow still looks polished during development.

## Production additions planned

- real Stripe product/price mapping via env
- customer creation and persistence
- subscription persistence in Prisma
- billing portal sessions
- invoice history sync
- webhook event idempotency
- failed webhook retry queue
