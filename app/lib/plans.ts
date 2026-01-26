// app/lib/plans.ts

// ✅ Export PlanCode so other modules (like AccessGate) can import it
export type PlanCode = "free" | "starter" | "pro" | "elite";

// Example plan normalization helper
export function normalizePlan(input: string): PlanCode {
  const value = input.toLowerCase().trim();

  if (value === "starter") return "starter";
  if (value === "pro") return "pro";
  if (value === "elite") return "elite";

  return "free";
}

// Example plan definitions (optional)
export const PLANS: Record<
  PlanCode,
  {
    name: string;
    price: number;
    features: string[];
  }
> = {
  free: {
    name: "Free",
    price: 0,
    features: ["Basic access"],
  },
  starter: {
    name: "Starter",
    price: 9.99,
    features: ["Expanded access", "Community features"],
  },
  pro: {
    name: "Pro",
    price: 29.99,
    features: ["Full platform access", "Premium tools"],
  },
  elite: {
    name: "Elite",
    price: 99.99,
    features: ["All features", "Direct support", "Investor-grade resources"],
  },
};
