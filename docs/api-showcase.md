# LaunchKit API Showcase

## Portfolio-ready flows

### 1. Owner registration
`POST /api/auth/register`

Creates a founder account and returns:
- user identity
- starter workspace
- session tokens
- next onboarding steps

### 2. Workspace catalog
`GET /api/workspaces`

Shows tenant-focused data like:
- plan
- members
- API key count
- billing status

### 3. Billing overview
`GET /api/billing/overview`

Displays:
- active plan
- Stripe identifiers
- usage limits
- next invoice timing

### 4. Stripe checkout
`POST /api/billing/checkout-session`

Creates a hosted billing flow suitable for SaaS upgrades.

### 5. Stripe webhook
`POST /api/billing/webhooks/stripe`

Accepts subscription lifecycle events for backend sync.

### 6. Workspace audit trail
`GET /api/audit/:workspaceId/logs`

Shows security and billing-sensitive events behind RBAC.

### 7. API key lifecycle
`POST /api/api-keys`
`GET /api/api-keys/:workspaceId`
`DELETE /api/api-keys/:workspaceId/:keyId`

Demonstrates production-style integration credential management.
