import { revenueSeries, workspaceSummary } from './mock-data';

export function RevenueCard() {
  const max = Math.max(...revenueSeries);
  return (
    <div className="card chart-card">
      <div className="table-title">Revenue snapshot</div>
      <div className="table-subtitle">Simple UI proof that billing data can surface cleanly in product dashboards.</div>
      <div className="chart-bars">
        {revenueSeries.map((value, index) => (
          <div key={index} className="chart-bar-wrap">
            <div className="chart-bar" style={{ height: `${(value / max) * 160}px` }} />
            <span>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkspaceSummaryCard() {
  return (
    <div className="card">
      <div className="table-title">Workspace health</div>
      <div className="table-subtitle">The kind of at-a-glance summary founders expect from a SaaS control panel.</div>
      <div className="summary-grid">
        {workspaceSummary.map((item) => (
          <div key={item.label} className="summary-item">
            <div className="summary-label">{item.label}</div>
            <div className="summary-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
