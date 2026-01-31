// app/lib/plans.ts

// ✅ Single source of truth for every valid plan code
export const PLAN_CODES = [
  "free",
  "starter",
  "growth",
  "builder",
  "pro",
  "enterprise",
  "elite",
] as const;

// ✅ PlanCode is derived directly from the list above
export type PlanCode = (typeof PLAN_CODES)[number];

// ✅ Normalize anything into a valid PlanCode
export function normalizePlan(input: string): PlanCode {
  const value = input.trim().toLowerCase();

  if (PLAN_CODES.includes(value as PlanCode)) {
    return value as PlanCode;
  }

  // Default fallback
  return "free";
}
