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
      {/* STARTER TIER */}
      <AccessGate required="starter">
        <div style={card}>
          <h2>Starter Tools</h2>
          <p>
            Basic financial tools designed for early-stage users and learners.
          </p>
        </div>
      </AccessGate>

      {/* PRO TIER */}
      <AccessGate required="pro">
        <div style={card}>
          <h2>Pro Tools</h2>
          <p>
            Advanced analytics, structured planning, and scaling-grade tools.
          </p>
        </div>
      </AccessGate>

      {/* ENTERPRISE TIER */}
      <AccessGate required="enterprise">
        <div style={card}>
          <h2>Enterprise Suite</h2>
          <p>
            Institutional-level systems, governance tooling, and compliance
            infrastructure.
          </p>
        </div>
      </AccessGate>
    </div>
  );
}
