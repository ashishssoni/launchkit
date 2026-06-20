# LaunchKit Request Flows

This document highlights the most important business flows in the system.

---

## 1. Owner Onboarding

1. user registers
2. backend creates user
3. backend creates workspace
4. backend assigns owner role
5. backend returns JWT session tokens

---

## 2. Authenticated Workspace Access

1. client sends bearer token
2. JWT guard validates token
3. endpoint loads memberships
4. role rules are checked if needed
5. business response is returned

---

## 3. Billing Upgrade

1. user selects a plan
2. backend creates Stripe checkout session
3. user completes hosted checkout
4. Stripe sends webhook
5. backend syncs subscription and workspace plan
6. audit event is recorded

---

## 4. API Key Lifecycle

1. admin/owner creates key
2. system returns raw token once
3. system stores only hash and prefix
4. key is later listed in masked form
5. key can be revoked by authorized roles

---

## 5. Audit Visibility

1. protected operations generate audit records
2. privileged users fetch workspace logs
3. logs support operational and security review
