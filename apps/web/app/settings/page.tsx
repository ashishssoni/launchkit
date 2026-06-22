import { AppShell } from '../../components/app-shell';

export default function SettingsPage() {
  return (
    <AppShell title="Settings" description="Workspace configuration and ownership controls presented in a polished admin UI." current="/settings">
      <div className="info-grid">
        <div className="card">
          <div className="stat-label">Workspace</div>
          <div className="stat-value" style={{ fontSize: 28 }}>LaunchKit Labs</div>
          <div className="helper">Slug: launchkit-labs</div>
          <div className="helper">Owner: founder@launchkit.dev</div>
        </div>
        <div className="card">
          <div className="stat-label">Plan and limits</div>
          <div className="stat-value" style={{ fontSize: 28 }}>Pro</div>
          <div className="helper">Includes billing, API keys, audit logs, and notifications.</div>
        </div>
      </div>
      <div className="card">
        <div className="table-title">Danger zone</div>
        <div className="table-subtitle">Placeholder UI for transfer of ownership, workspace archival, and team administration controls.</div>
        <div className="helper" style={{ marginTop: 16 }}>This screen helps clients visualize the broader SaaS admin experience without overbuilding the demo.</div>
      </div>
    </AppShell>
  );
}
