// types/plan.ts

/**
 * Canonical plan definitions.
 * This file is the SINGLE source of truth for:
 * - PlanCode
 * - PlanTier
 * - PLANS
 * - DEFAULT_PLAN
 * - isPlanCode
 * - normalizePlan
 * - hasAccess
 */

/* -----------------------------
   PLAN CODES
------------------------------ */

export const PLANS = [
  "free",
  "pro",
  "enterprise",
  "elite",
  "founder",
] as const;

export type PlanCode = typeof PLANS[number];

/* -----------------------------
   PLAN TIERS (OPTIONAL LAYER)
------------------------------ */

export type PlanTier =
  | "basic"
  | "advanced"
  | "institutional";

/* -----------------------------
   DEFAULT
------------------------------ */

export const DEFAULT_PLAN: PlanCode = "free";

/* -----------------------------
   TYPE GUARDS
------------------------------ */

export function isPlanCode(value: unknown): value is PlanCode {
  return typeof value === "string" && PLANS.includes(value as PlanCode);
}

/* -----------------------------
   NORMALIZATION
------------------------------ */

export function normalizePlan(value: unknown): PlanCode {
  if (isPlanCode(value)) return value;
  return DEFAULT_PLAN;
}

/* -----------------------------
   ACCESS LOGIC (AUTHORITATIVE)
------------------------------ */

const ACCESS_MATRIX: Record<PlanCode, PlanCode[]> = {
  free: ["free"],
  pro: ["free", "pro"],
  enterprise: ["free", "pro", "enterprise"],
  elite: ["free", "pro", "enterprise", "elite"],
  founder: ["free", "pro", "enterprise", "elite", "founder"],
};

export function hasAccess(
  userPlan: PlanCode,
  requiredPlan: PlanCode
): boolean {
  return ACCESS_MATRIX[userPlan]?.includes(requiredPlan) ?? false;
}
