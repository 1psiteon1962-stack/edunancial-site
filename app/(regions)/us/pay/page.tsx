import Link from "next/link";
import { PLANS } from "@/types/plan";
import type { PlanCode } from "@/types/plan";

const wrap: React.CSSProperties = {
  maxWidth: 1100,
  margin: "80px auto",
  padding: "0 24px"
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 24
};

const card: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 24,
  background: "#fff"
};

type PlanView = {
  code: PlanCode;
  label: string;
  name: string;
  description: string;
  price: string;
  features: string[];
};

const PLAN_VIEWS: PlanView[] = [
  {
    code: "free",
    label: "Free",
    name: "Free",
    description: "Get started with basic access.",
    price: "$0",
    features: ["Public articles", "Free tools", "Community access"]
  },
  {
    code: "starter",
    label: "Starter",
    name: "Starter",
    description: "For learners starting their business journey.",
    price: "$19 / mo",
    features: ["Everything in Free", "Starter courses", "Basic calculators"]
  },
  {
    code: "builder",
    label: "Builder",
    name: "Builder",
    description: "For people actively building companies.",
    price: "$49 / mo",
    features: ["Everything in Starter", "Advanced tools", "Templates"]
  },
  {
    code: "pro",
    label: "Pro",
    name: "Pro",
    description: "For serious founders.",
    price: "$99 / mo",
    features: ["Everything in Builder", "Legal playbooks", "Investor tools"]
  },
  {
    code: "founder",
    label: "Founder",
    name: "Founder",
    description: "Full access to Edunancial.",
    price: "$199 / mo",
    features: ["Everything in Pro", "Capital tools", "Premium support"]
  }
];

export default function PayPage() {
  return (
    <div style={wrap}>
      <h1 style={{ fontSize: 36, marginBottom: 40 }}>
        Choose Your Plan
      </h1>

      <div style={grid}>
        {PLAN_VIEWS.map((plan) => (
          <div key={plan.code} style={card}>
            <h2>{plan.label}</h2>
            <p style={{ opacity: 0.7 }}>{plan.description}</p>

            <div style={{ fontSize: 28, fontWeight: 800, margin: "16px 0" }}>
              {plan.price}
            </div>

            <ul>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <Link
              href={`/us/checkout?plan=${plan.code}`}
              style={{
                display: "block",
                marginTop: 24,
                textAlign: "center",
                padding: "12px",
                borderRadius: 8,
                background: "#000",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600
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
