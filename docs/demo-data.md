# Demo Data

LaunchKit includes seed data so GitHub visitors and clients can run the project quickly and explore realistic SaaS flows.

## Seed command

```bash
npm run db:seed
```

## Demo users

- Founder: `founder@launchkit.dev` / `StrongPass123!`
- Admin: `admin@launchkit.dev` / `AdminPass123!`
- Member: `member@launchkit.dev` / `MemberPass123!`

## Demo workspaces

### LaunchKit Labs
- Plan: `PRO`
- Stripe customer: demo value included
- Subscription: active
- Members: owner, admin, member
- API keys: seeded
- Audit events: seeded

### Founder Ops
- Plan: `FREE`
- Members: founder

## What this helps demonstrate

- login flows with realistic user roles
- multi-tenant workspace access
- Stripe billing overview data
- audit log visibility by role
- API key listing and revocation
- notification feed backed by audit activity
