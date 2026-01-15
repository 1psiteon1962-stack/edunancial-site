import Link from "next/link";
import { PLANS, PlanCode } from "@/types/plan";
import React from "react";

const wrap: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "48px 24px",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 24,
};

const card: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 14,
  padding: 24,
  background: "rgba(255,255,255,0.03)",
};

export default function PayPage() {
  const plans = Object.values(PLANS).sort((a, b) => a.rank - b.rank);

  return (
    <div style={wrap}>
      <h1 style={{ marginBottom: 12 }}>Choose Your Plan</h1>
      <p style={{ opacity: 0.8, marginBottom: 32 }}>
        Upgrade your access and unlock more systems, tools, and resources.
      </p>

      <div style={grid}>
        {plans.map((plan) => (
          <div key={plan.code} style={card}>
            <h2>{plan.label}</h2>
            <p style={{ opacity: 0.75 }}>{plan.description}</p>

            <div style={{ fontSize: 32, fontWeight: 800, margin: "16px 0" }}>
              {plan.price === 0 ? "Free" : `$${plan.price}`}
              {plan.price > 0 && (
                <span style={{ fontSize: 14, opacity: 0.7 }}>
                  /{plan.interval}
                </span>
              )}
            </div>

            <ul>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <Link
              href={`/us/checkout?plan=${plan.code}`}
              style={{
                display: "inline-block",
                marginTop: 18,
                padding: "12px 16px",
                borderRadius: 10,
                background: "#2563eb",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Select {plan.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
