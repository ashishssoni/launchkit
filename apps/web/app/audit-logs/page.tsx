import { AppShell } from '../../components/app-shell';
import { auditEvents } from '../../components/mock-data';

export default function AuditLogsPage() {
  return (
    <AppShell title="Audit Logs" description="Enterprise-style activity tracking for billing, credentials, and workspace administration." current="/audit-logs">
      <div className="workspace-banner">
        <div>
          <div className="plan-badge">Enterprise trust signal</div>
          <h2 style={{ margin: '14px 0 8px', fontSize: 28 }}>Show sensitive actions, billing changes, and admin events in one clean audit trail.</h2>
          <p className="page-copy" style={{ margin: 0 }}>This is one of the strongest screens for clients because it communicates security, accountability, and operational maturity.</p>
        </div>
        <a href="#" className="button-secondary">Export activity</a>
      </div>

      <div className="table-card">
        <div className="table-title-row">
          <div>
            <h3 className="table-title">Security and billing audit trail</h3>
            <div className="table-subtitle">A strong visual proof point for backend reliability and operational maturity.</div>
          </div>
          <div className="pill-row">
            <span className="pill">Billing</span>
            <span className="pill">Auth</span>
            <span className="pill">API Keys</span>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Actor</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Time</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {auditEvents.concat(auditEvents).slice(0, 6).map((event, index) => (
              <tr key={`${event.actor}-${event.time}-${index}`}>
                <td>{event.actor}</td>
                <td>{event.action}</td>
                <td>{event.entity}</td>
                <td>{event.time}</td>
                <td><span className={`status-badge ${event.severity}`}>{event.severity}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
