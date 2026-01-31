// app/lib/plans.ts

// ✅ Single source of truth for all valid plan codes
export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise"
  | "elite";

// Normalize any incoming string into a valid PlanCode
export function normalizePlan(plan: string): PlanCode {
  const p = (plan || "").toLowerCase().trim();

  if (p === "free") return "free";
  if (p === "starter") return "starter";
  if (p === "growth") return "growth";
  if (p === "builder") return "builder";
  if (p === "pro") return "pro";
  if (p === "enterprise") return "enterprise";
  if (p === "elite") return "elite";

  // Default fallback
  return "free";
}
