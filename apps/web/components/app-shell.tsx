import Link from 'next/link';
import { ReactNode } from 'react';

const nav = [
  ['Dashboard', '/dashboard'],
  ['Billing', '/billing'],
  ['API Keys', '/api-keys'],
  ['Audit Logs', '/audit-logs'],
  ['Notifications', '/notifications'],
  ['Settings', '/settings'],
];

export function AppShell({ title, description, current, children }: { title: string; description: string; current: string; children: ReactNode }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">LaunchKit</div>
          <div className="sidebar-copy">A polished SaaS admin demo built on top of the LaunchKit backend foundation.</div>
          <div>
            {nav.map(([label, href]) => (
              <Link key={href} href={href} className={`nav-link ${current === href ? 'active' : ''}`}>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="tiny-badge plan-badge">LaunchKit Labs</div>
          <div style={{ fontWeight: 800, marginTop: 10 }}>Taylor Reed</div>
          <div className="helper" style={{ marginTop: 8 }}>Product-focused backend architecture demo with billing, auth, API keys, and auditability.</div>
        </div>
      </aside>
      <main className="main-panel">
        <div className="topbar">
          <div>
            <h1 className="page-title">{title}</h1>
            <p className="page-copy">{description}</p>
          </div>
          <div className="inline-row">
            <span className="plan-badge">Pro workspace</span>
            <span className="avatar-badge">TR</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
