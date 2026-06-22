import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="form-page">
      <div className="form-card">
        <span className="kicker">Secure workspace access</span>
        <h1 className="page-title" style={{ marginTop: 18 }}>Sign in to LaunchKit</h1>
        <p className="page-copy">Access your workspace dashboard, billing controls, API keys, audit logs, and notifications.</p>
        <div className="form-grid">
          <div>
            <label className="label">Email</label>
            <input className="input" defaultValue="founder@launchkit.dev" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" defaultValue="StrongPass123!" />
          </div>
          <Link href="/dashboard" className="button">Sign in</Link>
        </div>
        <p className="helper">Demo UI for portfolio use. Connect this to LaunchKit auth APIs when ready.</p>
        <div className="inline-row" style={{ marginTop: 18 }}>
          <span className="helper">Need a workspace?</span>
          <Link href="/register" className="button-secondary">Create account</Link>
        </div>
      </div>
    </div>
  );
}
