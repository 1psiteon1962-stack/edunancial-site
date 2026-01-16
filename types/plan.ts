// types/plan.ts

/**
 * Canonical plan codes used everywhere in the app.
 * DO NOT create competing lists elsewhere.
 */
export type PlanCode =
  | "free"
  | "starter"
  | "founder"
  | "pro"
  | "elite"
  | "enterprise";

/**
 * Ordered from lowest → highest access
 */
export const PLAN_CODES: readonly PlanCode[] = [
  "free",
  "starter",
  "founder",
  "pro",
  "elite",
  "enterprise",
] as const;

/**
 * Legacy-compatible alias.
 * Some files still import `PLANS`.
 * Do NOT remove unless you refactor all imports.
 */
export const PLANS = PLAN_CODES;

/**
 * Default / fallback plan
 */
export const DEFAULT_PLAN: PlanCode = "free";

/**
 * Type guard
 */
export function isPlanCode(value: unknown): value is PlanCode {
  return (
    typeof value === "string" &&
    (PLAN_CODES as readonly string[]).includes(value)
  );
}

/**
 * Core access comparison
 */
export function hasAccess(
  userPlan: PlanCode,
  requiredPlan: PlanCode
): boolean {
  return (
    PLAN_CODES.indexOf(userPlan) >=
    PLAN_CODES.indexOf(requiredPlan)
  );
}
