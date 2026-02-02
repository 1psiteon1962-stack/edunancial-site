// app/lib/plans.ts

// ✅ SINGLE SOURCE OF TRUTH FOR ALL PLAN NAMES
export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise"
  | "elite";

// ✅ Normalize ANY input into a valid PlanCode
export function normalizePlan(input: string): PlanCode {
  const v = input.trim().toLowerCase();

  if (v === "free") return "free";
  if (v === "starter") return "starter";
  if (v === "growth") return "growth";
  if (v === "builder") return "builder";
  if (v === "pro") return "pro";
  if (v === "enterprise") return "enterprise";
  if (v === "elite") return "elite";

  // default fallback
  return "free";
}
