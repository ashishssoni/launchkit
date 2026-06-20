# LaunchKit Data Model

This document explains the business entities behind LaunchKit.

---

## Entity Summary

### User
Represents an authenticated person in the platform.

Key properties:
- email
- full name
- password hash
- refresh token hash
- email verification state

### Workspace
Represents a tenant/account boundary.

Key properties:
- name
- slug
- plan
- Stripe customer ID

### Membership
Joins users to workspaces with a role.

Key properties:
- user ID
- workspace ID
- role
- optional inviter reference

### Subscription
Represents billing state for a workspace.

Key properties:
- Stripe subscription ID
- Stripe price ID
- status
- billing period start/end
- cancel-at-period-end flag

### ApiKey
Represents an integration credential.

Key properties:
- workspace ID
- creator user ID
- name
- prefix
- hashed secret
- last used / revoked timestamps

### AuditLog
Represents a security or business event.

Key properties:
- workspace ID
- actor user ID
- actor type
- action
- entity type / entity ID
- metadata payload
- creation timestamp

---

## Business Constraints

- one user can belong to many workspaces
- one workspace can have many members
- one workspace can have one active subscription record
- API keys belong to a workspace and a creator
- audit logs are workspace-scoped

---

## Why this model matters for clients

This model supports common paid use cases like:
- team SaaS products
- subscription billing
- admin and billing permissions
- secure integration credentials
- compliance-friendly event visibility
