import { AppShell } from '../../components/app-shell';
import { billingHistory, pricing } from '../../components/mock-data';

export default function BillingPage() {
  return (
    <AppShell title="Billing" description="A premium SaaS billing page designed to complement Stripe-backed backend flows." current="/billing">
      <div className="workspace-banner">
        <div>
          <div className="plan-badge">Stripe-ready billing UI</div>
          <h2 style={{ margin: '14px 0 8px', fontSize: 28 }}>Give founders a clear path from plan selection to recurring revenue.</h2>
          <p className="page-copy" style={{ margin: 0 }}>This page translates subscription logic into a product-facing billing experience clients can immediately understand.</p>
        </div>
        <a href="#" className="button">Upgrade to Scale</a>
      </div>

      <div className="pricing-grid">
        {pricing.map((plan) => (
          <div key={plan.name} className="pricing-card">
            <span className="pill">{plan.name}</span>
            <div className="price">{plan.price}</div>
            <p className="feature-copy">{plan.description}</p>
            <div className="list" style={{ marginTop: 18 }}>
              {plan.features.map((feature) => (
                <div className="list-item" key={feature}>
                  <div className="list-title">{feature}</div>
                </div>
              ))}
            </div>
            <a className={plan.name === 'Pro' ? 'button' : 'button-secondary'} href="#" style={{ marginTop: 20 }}>
              {plan.name === 'Pro' ? 'Current plan' : 'Choose plan'}
            </a>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-title-row">
          <div>
            <h3 className="table-title">Billing history</h3>
            <div className="table-subtitle">Client-facing payment and invoice visibility.</div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {billingHistory.map((item) => (
              <tr key={item.invoice}>
                <td>{item.invoice}</td>
                <td>{item.amount}</td>
                <td><span className="status-badge success">{item.status}</span></td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
