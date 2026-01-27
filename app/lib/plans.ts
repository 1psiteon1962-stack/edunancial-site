// app/lib/plans.ts

export const plans = {
  free: {
    label: "Free",
  },

  starter: {
    label: "Starter",
  },

  pro: {
    label: "Pro",
  },

  enterprise: {
    label: "Enterprise",
  },
} as const;

/**
 * PlanCode is the allowed string union of all plan keys.
 */
export type PlanCode = keyof typeof plans;

/**
 * Normalize any incoming string into a valid PlanCode.
 * Defaults to "free" if unknown.
 */
export function normalizePlan(value: string): PlanCode {
  const cleaned = value.trim().toLowerCase();

  if (cleaned in plans) {
    return cleaned as PlanCode;
  }

  return "free";
}
