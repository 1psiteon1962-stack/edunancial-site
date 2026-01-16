"use client";

import { Plan, PlanCode } from "./types";

const plans: Plan[] = [
  {
    code: "free",
    name: "Free",
    label: "Free",
    description: "Public access to learning tools.",
    price: 0,
  },
  {
    code: "starter",
    name: "Starter",
    label: "Starter",
    description: "Entry-level business and finance tools.",
    price: 29,
  },
  {
    code: "founder",
    name: "Founder",
    label: "Founder",
    description: "Full business operating system.",
    price: 99,
  },
  {
    code: "builder",
    name: "Builder",
    label: "Builder",
    description: "For people actively building companies.",
    price: 199,
  },
  {
    code: "pro",
    name: "Professional",
    label: "Pro",
    description: "Scaling, capital, and automation tools.",
    price: 399,
  },
  {
    code: "elite",
    name: "Elite",
    label: "Elite",
    description: "Institutional-grade wealth and investment platform.",
    price: 999,
  },
];

export default function PayPage() {
  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 32 }}>
        Choose Your Plan
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.code}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 24,
              background: "#ffffff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>{plan.label}</h2>
            <p style={{ opacity: 0.8, marginTop: 8 }}>{plan.description}</p>

            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 16 }}>
              ${plan.price}/mo
            </div>

            <button
              style={{
                marginTop: 20,
                padding: "12px 20px",
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Select {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
