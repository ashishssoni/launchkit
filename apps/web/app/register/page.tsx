import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="form-page">
      <div className="form-card">
        <span className="kicker">SaaS onboarding flow</span>
        <h1 className="page-title" style={{ marginTop: 18 }}>Create your workspace</h1>
        <p className="page-copy">A frontend demo for owner registration, workspace creation, and product onboarding.</p>
        <div className="form-grid">
          <div>
            <label className="label">Full name</label>
            <input className="input" defaultValue="Ashish Soni" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" defaultValue="founder@launchkit.dev" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" defaultValue="StrongPass123!" />
          </div>
          <div>
            <label className="label">Workspace name</label>
            <input className="input" defaultValue="LaunchKit Labs" />
          </div>
          <Link href="/dashboard" className="button">Create workspace</Link>
        </div>
        <p className="helper">This page is intentionally optimized for screenshots and client demos.</p>
        <div className="inline-row" style={{ marginTop: 18 }}>
          <span className="helper">Already have access?</span>
          <Link href="/login" className="button-secondary">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
