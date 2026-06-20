# LaunchKit

> Production-ready **NestJS SaaS backend starter** with **Auth, Multi-Tenancy, RBAC, Stripe Billing, API Keys, Audit Logs, and Workspace Notifications**.

LaunchKit is built to showcase the exact backend capabilities startup founders and freelance clients usually need in a modern SaaS product.

## Highlights

- Authentication with JWT access/refresh flows
- Multi-tenant workspaces and memberships
- RBAC-protected workspace operations
- Stripe checkout + webhook subscription sync
- API key lifecycle management
- Audit trails for billing and security events
- Workspace activity/notification feed
- Swagger API docs + Dockerized local setup

## Why this structure is professional

This repository uses a **single-service backend layout** because LaunchKit is your flagship API project.

Instead of a noisy monorepo, it keeps everything focused and client-friendly:

```bash
launchkit/
  src/
    config/
    common/
    modules/
      health/
      auth/
      workspaces/
      billing/
      notifications/
      audit/
    app.module.ts
    main.ts
  prisma/
  docs/
  test/
  docker-compose.yml
  .env.example
  package.json
  tsconfig.json
```

This looks cleaner on GitHub and is easier for clients to understand quickly.

## Tech stack

- NestJS
- TypeScript
- Fastify adapter
- Swagger / OpenAPI
- Prisma ORM
- PostgreSQL
- Redis
- Stripe
- Docker Compose

## Current modules

- **Health** — API status endpoint
- **Auth** — Prisma-backed registration, login, token refresh, and profile endpoints
- **Workspaces** — protected tenant/workspace listing and detail endpoints
- **Billing** — protected Stripe checkout, webhook sync, and subscription overview
- **Notifications** — authenticated workspace event feed
- **Audit** — RBAC-protected audit trails
- **API Keys** — creation, listing, and revocation flows

## API preview

- API base: `http://localhost:3000/api`
- Swagger docs: `http://localhost:3000/docs`

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

```bash
cp .env.example .env
```

### 3. Start local infrastructure

```bash
docker compose up -d
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Run the API

```bash
npm run dev
```

## Example endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `GET /api/workspaces`
- `GET /api/workspaces/:slug`
- `GET /api/billing/overview/:workspaceId`
- `POST /api/billing/checkout-session`
- `POST /api/billing/webhooks/stripe`
- `GET /api/notifications/:workspaceId/feed`
- `GET /api/audit/:workspaceId/logs`
- `GET /api/api-keys/:workspaceId`
- `POST /api/api-keys`
- `DELETE /api/api-keys/:workspaceId/:keyId`

## Roadmap

### Phase 1 — Foundation
- [x] Professional single-service structure
- [x] NestJS API bootstrap
- [x] Swagger setup
- [x] Docker services
- [x] Seed portfolio endpoints

### Phase 2 — SaaS Core
- [x] Prisma models for users, workspaces, memberships
- [x] JWT auth + refresh tokens
- [x] workspace guards
- [x] RBAC/permissions
- [ ] request-scoped tenant context

### Phase 3 — Revenue + operations
- [x] Stripe checkout session scaffold
- [x] Stripe webhook endpoint scaffold
- [x] Stripe customer creation and subscription sync foundation
- [ ] billing portal
- [ ] usage metering
- [x] API keys
- [x] persistent audit logs

### Phase 4 — Premium signals
- [ ] BullMQ jobs
- [ ] websocket notifications
- [ ] tests
- [ ] CI
- [ ] deployment guide

## Portfolio value

LaunchKit is meant to show that you can design and build a backend system that is:

- modular
- scalable
- SaaS-ready
- production-oriented
- easy for teams to extend

## Push to GitHub

```bash
git init
git add .
git commit -m "feat: initialize LaunchKit NestJS SaaS backend starter"
```
