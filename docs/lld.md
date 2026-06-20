# LaunchKit LLD (Low-Level Design)

This document describes LaunchKit at the service, module, and data interaction level.

---

## 1. Module Breakdown

### Auth Module
Responsibilities:
- register owner account
- create initial workspace
- issue JWT tokens
- rotate refresh token
- return authenticated profile

Key files:
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/dto/*`

### Workspaces Module
Responsibilities:
- list user-accessible workspaces
- load workspace details by slug
- return members and subscription context

### Billing Module
Responsibilities:
- billing overview
- checkout session creation
- Stripe customer handling
- Stripe webhook verification and subscription sync

### API Keys Module
Responsibilities:
- list workspace keys
- create hashed API keys
- revoke keys
- record audit entries

### Audit Module
Responsibilities:
- return security-sensitive activity history
- restrict access by role

### Notifications Module
Responsibilities:
- expose recent workspace activity feed
- map audit-style actions to readable titles

---

## 2. Shared Infrastructure Components

### `PrismaService`
Provides:
- database connectivity
- lifecycle startup/shutdown hooks

### `JwtAuthGuard`
Provides:
- bearer token verification
- request user injection

### `WorkspaceRoleGuard`
Provides:
- workspace membership enforcement
- role-based access checks against metadata

### Utility helpers
- `password.util.ts` — password hashing/verification
- `slug.util.ts` — workspace slug creation
- `api-key.util.ts` — key generation + hashing
- `stripe.service.ts` — Stripe SDK wrapper

---

## 3. Core Entity Relationships

```mermaid
erDiagram
    USER ||--o{ MEMBERSHIP : has
    WORKSPACE ||--o{ MEMBERSHIP : contains
    WORKSPACE ||--o| SUBSCRIPTION : has
    WORKSPACE ||--o{ API_KEY : owns
    WORKSPACE ||--o{ AUDIT_LOG : records
    USER ||--o{ API_KEY : creates
    USER ||--o{ AUDIT_LOG : acts_in
```

---

## 4. Registration Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as AuthController
    participant S as AuthService
    participant P as Prisma

    C->>A: POST /auth/register
    A->>S: registerOwner(dto)
    S->>P: create user
    S->>P: create workspace
    S->>P: create owner membership
    S->>P: create audit log
    S->>S: issue access/refresh tokens
    S-->>A: user + workspace + session
    A-->>C: JSON response
```

---

## 5. Billing Sync Flow

```mermaid
sequenceDiagram
    participant U as User
    participant B as BillingController
    participant S as BillingService
    participant St as Stripe
    participant P as Prisma

    U->>B: POST /billing/checkout-session
    B->>S: createCheckoutSession
    S->>St: create customer if needed
    S->>St: create checkout session
    S->>P: audit log for session creation
    St-->>B: session URL

    St->>B: POST /billing/webhooks/stripe
    B->>S: handleWebhookEvent
    S->>P: sync subscription
    S->>P: update workspace plan
    S->>P: write audit event
```

---

## 6. API Key Creation Flow

1. authenticated user calls `POST /api/api-keys`
2. JWT guard validates identity
3. workspace role guard checks owner/admin role
4. service generates raw token and prefix
5. only token hash is stored
6. audit log is written
7. raw token is returned once

---

## 7. Important Implementation Notes

- refresh tokens are re-issued and re-hashed
- API key plaintext is never persisted
- RBAC is driven by workspace membership role
- notification feed currently derives from audit/activity events
- Stripe metadata carries workspace linkage for sync

---

## 8. Best Candidates for Further Refinement

- request-scoped tenant resolver
- custom exception filters
- DTO response contracts
- integration tests per module
- queue-backed webhook retry handling
- websocket notifications for near-real-time events
