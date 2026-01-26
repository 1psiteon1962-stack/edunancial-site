// app/lib/plans.ts

// ✅ EXPORT THE TYPE (this is what Netlify is demanding)
export type PlanCode = "starter" | "growth" | "enterprise";

// ✅ Normalizer stays exported
export function normalizePlan(plan: string): PlanCode {
  const p = plan.toLowerCase().trim();

  if (p === "starter" || p === "basic") return "starter";
  if (p === "growth" || p === "pro") return "growth";
  if (p === "enterprise") return "enterprise";

  return "starter";
}

// ✅ Optional plan metadata
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
    description: "Expanded access for builders.",
    features: ["Full library", "Premium tools", "Growth systems"],
  },
  enterprise: {
    name: "Enterprise",
    price: 49.99,
    description: "Institutional-level access.",
    features: ["All access", "Investor-grade structure", "Enterprise support"],
  },
};
