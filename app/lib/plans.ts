// app/lib/plans.ts

export const plans = {
  free: {
    name: "Free",
    price: 0,
  },
  starter: {
    name: "Starter",
    price: 4.99,
  },
  growth: {
    name: "Growth",
    price: 9.99,
  },
} as const;

/**
 * ✅ THIS EXPORT IS WHAT NETLIFY IS FAILING ON
 */
export type PlanCode = keyof typeof plans;

/**
 * Normalize incoming values into a valid PlanCode.
 */
export function normalizePlan(value: string): PlanCode {
  const v = value?.toLowerCase();

  if (v === "starter") return "starter";
  if (v === "growth") return "growth";

  return "free";
}
