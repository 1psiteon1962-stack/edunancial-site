// app/lib/plans.ts
// SINGLE SOURCE OF TRUTH FOR ALL PLAN CODES

export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise"
  | "elite";

/**
 * Normalize any incoming plan string into a valid PlanCode.
 * Anything unknown defaults to "free".
 */
export function normalizePlan(value: string): PlanCode {
  const v = value.toLowerCase().trim();

  if (
    v === "free" ||
    v === "starter" ||
    v === "growth" ||
    v === "builder" ||
    v === "pro" ||
    v === "enterprise" ||
    v === "elite"
  ) {
    return v;
  }

  return "free";
}
