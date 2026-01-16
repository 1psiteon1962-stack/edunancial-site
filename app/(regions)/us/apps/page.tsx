// app/(regions)/us/apps/page.tsx

import AccessGate from "../../../../components/AccessGate";

const card: React.CSSProperties = {
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1rem",
};

export default function AppsPage() {
  return (
    <div>
      <AccessGate required="starter">
        <div style={card}>
          <h2>Starter Tools</h2>
          <p>Entry-level financial and planning tools.</p>
        </div>
      </AccessGate>

      <AccessGate required="pro">
        <div style={card}>
          <h2>Pro Tools</h2>
          <p>Advanced analytics and scaling systems.</p>
        </div>
      </AccessGate>

      <AccessGate required="enterprise">
        <div style={card}>
          <h2>Enterprise Suite</h2>
          <p>Institutional-grade governance and compliance tooling.</p>
        </div>
      </AccessGate>
    </div>
  );
}
