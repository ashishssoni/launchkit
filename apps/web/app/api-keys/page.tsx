import { AppShell } from '../../components/app-shell';
import { apiKeys } from '../../components/mock-data';

export default function ApiKeysPage() {
  return (
    <AppShell title="API Keys" description="A B2B-friendly credentials management screen that makes backend capability visible to clients." current="/api-keys">
      <div className="workspace-banner">
        <div>
          <div className="plan-badge">Developer-product experience</div>
          <h2 style={{ margin: '14px 0 8px', fontSize: 28 }}>Expose secure integration access without losing operational control.</h2>
          <p className="page-copy" style={{ margin: 0 }}>A clean UI for issuing, rotating, and revoking keys makes the backend feel B2B-ready instead of purely internal.</p>
        </div>
        <a href="#" className="button">Create new key</a>
      </div>

      <div className="table-card">
        <div className="table-title-row">
          <div>
            <h3 className="table-title">Workspace API keys</h3>
            <div className="table-subtitle">Create, rotate, and revoke programmatic access for integrations.</div>
          </div>
          <a href="#" className="button">Create key</a>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Prefix</th>
              <th>Created</th>
              <th>Last used</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.prefix}••••••</td>
                <td>{item.created}</td>
                <td>{item.lastUsed}</td>
                <td><span className={`status-badge ${item.status === 'Active' ? 'success' : 'danger'}`}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="empty">New keys are shown once on creation. This UI is ideal for screenshots because it instantly communicates B2B SaaS product maturity.</div>
    </AppShell>
  );
}
