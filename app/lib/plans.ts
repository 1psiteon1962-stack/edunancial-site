// app/lib/plans.ts
// ============================================================
// Canonical Plan Registry (Netlify-safe)
// Fixes: "PlanCode declared locally but not exported"
// ============================================================

export const plans = {
  free: {
    label: "Free",
    price: 0,
    description: "Basic access for all users",
  },

  pro: {
    label: "Pro",
    price: 9.99,
    description: "Premium subscriber access",
  },

  enterprise: {
    label: "Enterprise",
    price: 49.99,
    description: "Institutional and full organization access",
  },
} as const;

/**
 * ✅ THIS MUST BE EXPORTED OR NETLIFY WILL FAIL
 */
export type PlanCode = keyof typeof plans;

/**
 * Normalize user input into a valid PlanCode.
 * Defaults safely to "free".
 */
export function normalizePlan(input: string): PlanCode {
  const key = input?.toLowerCase()?.trim();

  if (key && key in plans) {
    return key as PlanCode;
  }

  return "free";
}

/**
 * Convenience helper
 */
export function getPlan(code: PlanCode) {
  return plans[code];
}
