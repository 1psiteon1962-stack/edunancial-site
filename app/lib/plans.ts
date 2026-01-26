// app/lib/plans.ts

export const plans = {
  free: {
    code: "free",
    name: "Free",
  },
  starter: {
    code: "starter",
    name: "Starter",
  },
  growth: {
    code: "growth",
    name: "Growth",
  },
  enterprise: {
    code: "enterprise",
    name: "Enterprise",
  },
} as const;

/** ✅ Export PlanCode so other modules can import it */
export type PlanCode = keyof typeof plans;

/** Normalize any input into a valid PlanCode */
export function normalizePlan(value: string): PlanCode {
  const key = value?.toLowerCase() as PlanCode;
  return key in plans ? key : "free";
}
