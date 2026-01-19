import AccessGate from "@/components/AccessGate";

export default function AppsPage() {
  const card = {
    padding: "1.25rem",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    marginBottom: "1rem",
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Applications</h1>

      <AccessGate required="STARTER">
        <div style={card}>
          <h2>Starter Tools</h2>
          <p>Entry-level financial and planning tools.</p>
        </div>
      </AccessGate>

      <AccessGate required="FOUNDER">
        <div style={card}>
          <h2>Founder Tools</h2>
          <p>Advanced business and capital-readiness tools.</p>
        </div>
      </AccessGate>

      <AccessGate required="PRO">
        <div style={card}>
          <h2>Pro Tools</h2>
          <p>Institutional-grade analytics and KPI monitoring.</p>
        </div>
      </AccessGate>
    </div>
  );
}
