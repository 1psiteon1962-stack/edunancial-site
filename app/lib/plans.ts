// app/lib/plans.ts

// ✅ Single source of truth for all plan codes used across the site
export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise"
  | "elite";

// Normalize any incoming string into a valid PlanCode
export function normalizePlan(input: string): PlanCode {
  const value = (input || "").toLowerCase().trim();

  if (value === "free") return "free";
  if (value === "starter") return "starter";
  if (value === "growth") return "growth";
  if (value === "builder") return "builder";
  if (value === "pro") return "pro";
  if (value === "enterprise") return "enterprise";
  if (value === "elite") return "elite";

  // Default fallback
  return "free";
}
