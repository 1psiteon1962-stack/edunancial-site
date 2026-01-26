// app/lib/plans.ts

// ✅ Export PlanCode so other modules (like AccessGate) can import it
export type PlanCode = "starter" | "growth" | "enterprise";

// Optional: plan normalization helper
export function normalizePlan(plan: string): PlanCode {
  const p = plan.toLowerCase();

  if (p === "starter" || p === "basic") return "starter";
  if (p === "growth" || p === "pro") return "growth";
  if (p === "enterprise") return "enterprise";

  // Default fallback
  return "starter";
}

// Example plan definitions (if needed elsewhere)
export const PLANS: Record<
  PlanCode,
  {
    name: string;
    price: number;
    description: string;
  }
> = {
  starter: {
    name: "Starter",
    price: 4.99,
    description: "Entry access for individuals beginning financial literacy.",
  },
  growth: {
    name: "Growth",
    price: 9.99,
    description: "Expanded tools, education, and structured growth support.",
  },
  enterprise: {
    name: "Enterprise",
    price: 49.99,
    description: "Full access for organizations, firms, and investor systems.",
  },
};
