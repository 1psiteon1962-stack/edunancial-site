// app/lib/plans.ts
// Single source of truth for plan codes + normalization.
// NO JSX allowed in this file.

export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise"
  | "elite";

export function normalizePlan(input: string): PlanCode {
  const v = String(input || "").toLowerCase().trim();

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
