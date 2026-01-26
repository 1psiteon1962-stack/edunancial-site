// app/lib/plans.ts

// ✅ THIS MUST BE EXPORTED
export type PlanCode = "starter" | "growth" | "enterprise";

// ✅ Normalizer used by AccessGate
export function normalizePlan(plan: string): PlanCode {
  const p = plan.toLowerCase().trim();

  if (p === "starter" || p === "basic") return "starter";
  if (p === "growth" || p === "pro") return "growth";
  if (p === "enterprise") return "enterprise";

  return "starter";
}

// ✅ Optional: Plan metadata
export const PLANS: Record<
  PlanCode,
  {
    name: string;
    price: number;
    description: string;
    features: string[];
  }
> = {
  starter: {
    name: "Starter",
    price: 4.99,
    description: "Entry-level access.",
    features: ["Core education", "Basic tools"],
  },
  growth: {
    name: "Growth",
    price: 9.99,
    description: "Expanded access for serious builders.",
    features: ["Full library", "Premium tools", "Growth systems"],
  },
  enterprise: {
    name: "Enterprise",
    price: 49.99,
    description: "Institutional-level access.",
    features: ["All access", "Investor-grade structure", "Enterprise support"],
  },
};
