// app/lib/plans.ts

// ✅ Single source of truth for ALL plan codes used anywhere
export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise"
  | "elite";

// Normalize any incoming string into a valid PlanCode
export function normalizePlan(value: string): PlanCode {
  const v = (value || "").toLowerCase().trim();

  if (v === "free") return "free";
  if (v === "starter") return "starter";
  if (v === "growth") return "growth";
  if (v === "builder") return "builder";
  if (v === "pro") return "pro";
  if (v === "enterprise") return "enterprise";
  if (v === "elite") return "elite";

  // Default fallback
  return "free";
}
