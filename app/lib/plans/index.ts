// app/lib/plans/index.ts

export type PlanCode = "starter" | "growth" | "enterprise";

export function normalizePlan(plan: string): PlanCode {
  const p = plan.toLowerCase().trim();

  if (p === "starter" || p === "basic") return "starter";
  if (p === "growth" || p === "pro") return "growth";
  if (p === "enterprise") return "enterprise";

  return "starter";
}

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
    description: "Expanded access.",
    features: ["Full library", "Premium tools"],
  },
  enterprise: {
    name: "Enterprise",
    price: 49.99,
    description: "Institutional access.",
    features: ["All access", "Support"],
  },
};
