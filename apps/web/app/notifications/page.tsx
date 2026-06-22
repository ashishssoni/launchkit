import { AppShell } from '../../components/app-shell';
import { notifications } from '../../components/mock-data';

export default function NotificationsPage() {
  return (
    <AppShell title="Notifications" description="A clean workspace activity feed that makes the SaaS experience feel complete." current="/notifications">
      <div className="inline-row">
        <div className="pill-row">
          <span className="pill">All</span>
          <span className="pill">Unread</span>
          <span className="pill">Billing</span>
          <span className="pill">Workspace</span>
        </div>
        <a href="#" className="button-secondary">Mark all read</a>
      </div>
      <div className="list">
        {notifications.concat(notifications).slice(0, 5).map((item, index) => (
          <div key={`${item.title}-${index}`} className="list-item">
            <div className="inline-row" style={{ marginBottom: 12 }}>
              <div className="list-title">{item.title}</div>
              <span className={`status-badge ${item.status === 'Unread' ? 'warning' : 'neutral'}`}>{item.status}</span>
            </div>
            <div className="list-copy">{item.body}</div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
