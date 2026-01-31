// app/lib/plans.ts
// SINGLE SOURCE OF TRUTH for all plan codes in the entire project.

export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise"
  | "elite";

/**
 * normalizePlan()
 * Converts any incoming string into a valid PlanCode.
 * Anything unknown falls back to "free".
 */
export function normalizePlan(value: string): PlanCode {
  const v = value.trim().toLowerCase();

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
