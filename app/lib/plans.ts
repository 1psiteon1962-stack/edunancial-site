// app/lib/plans.ts
// Single source of truth for all plan codes used across the site.

export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise"
  | "elite";

export function normalizePlan(input: string): PlanCode {
  const value = (input || "").toLowerCase().trim();

  // Accept common aliases
  if (value === "basic") return "free";
  if (value === "premium") return "pro";

  // Valid plans
  if (
    value === "free" ||
    value === "starter" ||
    value === "growth" ||
    value === "builder" ||
    value === "pro" ||
    value === "enterprise" ||
    value === "elite"
  ) {
    return value;
  }

  // Default fallback
  return "free";
}
