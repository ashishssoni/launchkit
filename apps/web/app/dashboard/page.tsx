import { AppShell } from '../../components/app-shell';
import { RevenueCard, WorkspaceSummaryCard } from '../../components/dashboard-widgets';
import { auditEvents, notifications, stats } from '../../components/mock-data';

export default function DashboardPage() {
  return (
    <AppShell title="Workspace dashboard" description="A polished admin view for the LaunchKit backend foundation." current="/dashboard">
      <div className="workspace-banner">
        <div>
          <div className="plan-badge">LaunchKit Labs • Pro</div>
          <h2 style={{ margin: '12px 0 6px', fontSize: 28 }}>A clean SaaS dashboard for billing, auth, and operations.</h2>
          <p className="page-copy" style={{ margin: 0 }}>Show clients the product result, not just the backend routes.</p>
        </div>
        <a className="button" href="/billing">Review billing</a>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-footnote">{stat.footnote}</div>
            <div className="stat-trend">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div style={{ display: 'grid', gap: 18 }}>
          <RevenueCard />
          <div className="table-card">
          <div className="table-title-row">
            <div>
              <h3 className="table-title">Recent audit activity</h3>
              <div className="table-subtitle">Critical product events from billing, auth, and admin flows.</div>
            </div>
            <span className="plan-badge">Live-ready UI</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {auditEvents.map((event) => (
                <tr key={`${event.actor}-${event.time}`}>
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
        </div>
        <div style={{ display: 'grid', gap: 18 }}>
          <WorkspaceSummaryCard />
          <div className="table-card">
          <div className="table-title-row">
            <div>
              <h3 className="table-title">Notifications feed</h3>
              <div className="table-subtitle">Recent account and workspace alerts.</div>
            </div>
          </div>
          <div className="list">
            {notifications.map((item) => (
              <div key={item.title} className="list-item">
                <div className="inline-row" style={{ marginBottom: 10 }}>
                  <div className="list-title">{item.title}</div>
                  <span className={`status-badge ${item.status === 'Unread' ? 'warning' : 'neutral'}`}>{item.status}</span>
                </div>
                <div className="list-copy">{item.body}</div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
