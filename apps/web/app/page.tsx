import Link from 'next/link';
import { pricing } from '../components/mock-data';

const features = [
  {
    title: 'Authentication and access control',
    copy: 'JWT auth, refresh tokens, workspace membership, and permission-aware backend design for modern SaaS products.',
  },
  {
    title: 'Billing-ready infrastructure',
    copy: 'Stripe checkout and webhook synchronization flows that make recurring subscriptions feel product-ready.',
  },
  {
    title: 'API keys and auditability',
    copy: 'B2B-friendly programmatic access, audit trails, and operational visibility built into the backend model.',
  },
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <section className="marketing-hero">
        <div>
          <span className="hero-kicker">Full-stack LaunchKit demo</span>
          <h1 className="hero-title">Launch a SaaS product with a backend and admin experience that already feels production-ready.</h1>
          <p className="hero-copy">
            LaunchKit combines a NestJS backend foundation with a polished frontend demo for auth, billing, API keys, audit logs,
            notifications, and workspace operations.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="button">Create workspace</Link>
            <Link href="/dashboard" className="button-secondary">View product dashboard</Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="mock-window">
            <div className="mock-topbar">
              <strong>LaunchKit Labs</strong>
              <span>Pro Plan • Stripe Connected</span>
            </div>
            <div className="mock-grid">
              <div className="mock-card"><strong>API Keys</strong><div style={{ marginTop: 10 }}>12 active integrations</div></div>
              <div className="mock-card"><strong>Audit Logs</strong><div style={{ marginTop: 10 }}>1.8k security events</div></div>
              <div className="mock-card"><strong>Billing</strong><div style={{ marginTop: 10 }}>Recurring subscription healthy</div></div>
              <div className="mock-card"><strong>Notifications</strong><div style={{ marginTop: 10 }}>7 unread workspace events</div></div>
            </div>
            <div className="mock-card"><strong>Product-ready outcome</strong><div style={{ marginTop: 10, color: '#cbd5e1', lineHeight: 1.7 }}>Clients instantly see a real SaaS control panel instead of just backend routes and architecture docs.</div></div>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <h2 className="section-title">Built for SaaS founders and product teams</h2>
        <p className="section-copy">
          LaunchKit showcases the exact backend foundations teams usually need before scaling: secure auth, tenant isolation,
          subscription billing, programmatic access, auditability, and product dashboards that make the platform feel real.
        </p>
        <div className="feature-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-copy">{feature.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="marketing-section">
        <h2 className="section-title">Billing-ready product experience</h2>
        <p className="section-copy">A frontend showcase for the Stripe-ready backend flows already modeled inside LaunchKit.</p>
        <div className="pricing-grid">
          {pricing.map((plan) => (
            <div key={plan.name} className="pricing-card">
              <span className="pill">{plan.name}</span>
              <div className="price">{plan.price}</div>
              <p className="feature-copy">{plan.description}</p>
              <div className="list" style={{ marginTop: 16 }}>
                {plan.features.map((feature) => (
                  <div key={feature} className="list-item">
                    <div className="list-title">{feature}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
