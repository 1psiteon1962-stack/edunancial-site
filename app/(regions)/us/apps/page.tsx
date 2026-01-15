import AccessGate from "../components/AccessGate";

const wrap: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "48px 24px",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 24,
};

const card: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 14,
  padding: 22,
  background: "rgba(255,255,255,0.03)",
};

export default function AppsPage() {
  return (
    <div style={wrap}>
      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 10 }}>Apps & Tools</h1>
      <p style={{ opacity: 0.85, marginBottom: 28 }}>
        Tools get unlocked by tier. Upgrade when you’re ready to move faster.
      </p>

      <div style={grid}>
        <div style={card}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Free Tools</div>
          <div style={{ opacity: 0.8, marginTop: 8 }}>
            Basic calculators and starter materials.
          </div>
        </div>

        <AccessGate required="starter">
          <div style={card}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Starter Tools</div>
            <div style={{ opacity: 0.8, marginTop: 8 }}>
              Templates + guided steps for consistency.
            </div>
          </div>
        </AccessGate>

        <AccessGate required="builder">
          <div style={card}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Builder Tools</div>
            <div style={{ opacity: 0.8, marginTop: 8 }}>
              Intermediate toolkits and structured systems.
            </div>
          </div>
        </AccessGate>

        <AccessGate required="pro">
          <div style={card}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Pro Tools</div>
            <div style={{ opacity: 0.8, marginTop: 8 }}>
              Advanced playbooks for entrepreneurs.
            </div>
          </div>
        </AccessGate>

        <AccessGate required="founder">
          <div style={card}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Founder Tools</div>
            <div style={{ opacity: 0.8, marginTop: 8 }}>
              Executive-level structure and scaling frameworks.
            </div>
          </div>
        </AccessGate>

        <AccessGate required="elite">
          <div style={card}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Elite Tools</div>
            <div style={{ opacity: 0.8, marginTop: 8 }}>
              Highest-tier resources + concierge structure (future-ready).
            </div>
          </div>
        </AccessGate>
      </div>
    </div>
  );
}
