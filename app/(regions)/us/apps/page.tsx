import AccessGate from "../components/AccessGate";

const card: React.CSSProperties = {
  border: "1px solid #e5e5e5",
  borderRadius: 14,
  padding: 14,
};

export default function USAppsPage() {
  return (
    <main>
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>US Apps</h1>
      <p style={{ marginTop: 0, opacity: 0.85 }}>
        Founder tools. Some are free. Some are plan-gated. Real payments will be wired later.
      </p>

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <div style={card}>
          <div style={{ fontWeight: 800 }}>KPI Quick Tracker</div>
          <div style={{ opacity: 0.85, marginTop: 6 }}>
            Track leads → conversions → revenue (basic).
          </div>
          <div style={{ marginTop: 10 }}>
            <a href="/metrics" style={{ fontWeight: 800, textDecoration: "none" }}>Open Metrics</a>
          </div>
        </div>

        <AccessGate required="starter">
          <div style={card}>
            <div style={{ fontWeight: 800 }}>Business Formation Planner (US)</div>
            <div style={{ opacity: 0.85, marginTop: 6 }}>
              Choose entity type, basic compliance checklist, next actions.
            </div>
            <div style={{ marginTop: 10, opacity: 0.9 }}>
              (Tool UI placeholder — next build)
            </div>
          </div>
        </AccessGate>

        <AccessGate required="pro">
          <div style={card}>
            <div style={{ fontWeight: 800 }}>Cybersecurity Builder</div>
            <div style={{ opacity: 0.85, marginTop: 6 }}>
              MFA, backups, firewall posture checklist, vendor access control.
            </div>
            <div style={{ marginTop: 10, opacity: 0.9 }}>
              (Tool UI placeholder — next build)
            </div>
          </div>
        </AccessGate>

        <AccessGate required="elite">
          <div style={card}>
            <div style={{ fontWeight: 800 }}>Capital Readiness Score</div>
            <div style={{ opacity: 0.85, marginTop: 6 }}>
              Diligence readiness, governance, defensibility, metrics pack.
            </div>
            <div style={{ marginTop: 10, opacity: 0.9 }}>
              (Tool UI placeholder — next build)
            </div>
          </div>
        </AccessGate>
      </div>
    </main>
  );
}
