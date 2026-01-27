// app/lib/plans.ts
// Full canonical plan definitions + exported PlanCode type
// This fixes the Netlify build error where PlanCode was declared but not exported.

export const plans = {
  free: {
    label: "Free",
    price: 0,
    description: "Basic access for all users",
  },

  pro: {
    label: "Pro",
    price: 9.99,
    description: "Full access to premium tools and content",
  },

  enterprise: {
    label: "Enterprise",
    price: 49.99,
    description: "Institutional and organizational access",
  },
} as const;

/**
 * ✅ Exported PlanCode type
 * Netlify was failing because this type existed but was not exported.
 */
export type PlanCode = keyof typeof plans;

/**
 * Normalize any incoming string into a valid PlanCode.
 * Defaults safely to "free".
 */
export function normalizePlan(value: string): PlanCode {
  const cleaned = value?.toLowerCase()?.trim();

  if (cleaned in plans) {
    return cleaned as PlanCode;
  }

  return "free";
}

/**
 * Optional helper: get a plan object safely.
 */
export function getPlan(plan: PlanCode) {
  return plans[plan];
}
