import Link from "next/link";
import { PLANS, PlanCode } from "../../../types/plan";

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
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  padding: 24,
  background: "rgba(255,255,255,0.02)",
};

const btn: React.CSSProperties = {
  display: "inline-block",
  marginTop: 16,
  padding: "12px 18px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 600,
};

export default function PayPage() {
  const planEntries = Object.entries(PLANS) as [PlanCode, typeof PLANS[PlanCode]][];

  return (
    <div style={wrap}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
        Choose Your Plan
      </h1>

      <p style={{ opacity: 0.85, marginBottom: 32 }}>
        Pick the level that matches how serious you are about building wealth and
        financial independence.
      </p>

      <div style={grid}>
        {planEntries.map(([code, plan]) => (
          <div key={code} style={card}>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>{plan.name}</h2>

            <div style={{ fontSize: 32, fontWeight: 800, margin: "12px 0" }}>
              ${plan.price}
              <span style={{ fontSize: 16, opacity: 0.7 }}>
                /{plan.interval}
              </span>
            </div>

            <p style={{ opacity: 0.8 }}>{plan.description}</p>

            <ul style={{ marginTop: 16, paddingLeft: 20 }}>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <Link href={`/us/checkout?plan=${code}`} style={btn}>
              Select {plan.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
