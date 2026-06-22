export const stats = [
  { label: 'Current plan', value: 'Pro', footnote: 'Stripe subscription active', trend: '+ upgraded this month' },
  { label: 'API keys', value: '12', footnote: '3 rotated this month', trend: '+ 2 new integrations' },
  { label: 'Audit events', value: '1.8k', footnote: 'Across billing and admin flows', trend: '+ healthy activity trail' },
  { label: 'Notifications', value: '24', footnote: '7 unread workspace events', trend: '+ realtime product updates' },
];

export const auditEvents = [
  { actor: 'Taylor Reed', action: 'Upgraded workspace plan', entity: 'Workspace', time: '2 mins ago', severity: 'success' },
  { actor: 'Finance Bot', action: 'Stripe webhook synced', entity: 'Subscription', time: '11 mins ago', severity: 'neutral' },
  { actor: 'Morgan Lee', action: 'Created API key', entity: 'API Key', time: '34 mins ago', severity: 'success' },
  { actor: 'Taylor Reed', action: 'Invited workspace member', entity: 'Membership', time: '1 hour ago', severity: 'warning' },
];

export const notifications = [
  { title: 'Stripe subscription renewed', body: 'Workspace Pro plan was renewed successfully and entitlements remain active.', status: 'Unread' },
  { title: 'New API key created', body: 'A new server-to-server integration key was issued for production access.', status: 'Read' },
  { title: 'Owner invited a new teammate', body: 'Permissions were updated for the LaunchKit Labs workspace.', status: 'Read' },
  { title: 'Audit alert resolved', body: 'The latest security review passed and no suspicious activity remains open.', status: 'Unread' },
];

export const pricing = [
  { name: 'Free', price: '$0', description: 'For early testing and internal validation.', features: ['JWT auth', '1 workspace', 'Basic notifications'] },
  { name: 'Pro', price: '$49', description: 'Best fit for product teams launching a SaaS.', features: ['Stripe billing', 'API keys', 'Audit logs', 'Advanced permissions'] },
  { name: 'Scale', price: '$199', description: 'For growing products that need reliability and control.', features: ['Priority support', 'Multiple admins', 'Advanced reporting', 'Higher event limits'] },
];

export const apiKeys = [
  { name: 'Production server', prefix: 'lk_prod_', created: 'Jun 17, 2026', lastUsed: '2 mins ago', status: 'Active' },
  { name: 'Staging sync', prefix: 'lk_stg_', created: 'Jun 10, 2026', lastUsed: '1 day ago', status: 'Active' },
  { name: 'Legacy integration', prefix: 'lk_old_', created: 'May 28, 2026', lastUsed: 'Revoked', status: 'Revoked' },
];

export const billingHistory = [
  { invoice: 'INV-1024', amount: '$49.00', status: 'Paid', date: 'Jun 18, 2026' },
  { invoice: 'INV-1011', amount: '$49.00', status: 'Paid', date: 'May 18, 2026' },
  { invoice: 'INV-0982', amount: '$19.00', status: 'Paid', date: 'Apr 18, 2026' },
];

export const revenueSeries = [42, 48, 53, 57, 61, 74, 79];

export const workspaceSummary = [
  { label: 'Active seats', value: '14' },
  { label: 'Monthly active keys', value: '7' },
  { label: 'Webhook health', value: '99.9%' },
];
