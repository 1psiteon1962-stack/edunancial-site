// types/plan.ts

export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "elite"
  | "enterprise";

/**
 * Ordered list of plan codes from lowest → highest
 */
export const PLAN_CODES: readonly PlanCode[] = [
  "free",
  "starter",
  "pro",
  "elite",
  "enterprise",
] as const;

/**
 * Default plan for unauthenticated / fallback cases
 */
export const DEFAULT_PLAN: PlanCode = "free";

/**
 * Type guard — REQUIRED by lib/access.ts
 */
export function isPlanCode(value: unknown): value is PlanCode {
  return (
    typeof value === "string" &&
    (PLAN_CODES as readonly string[]).includes(value)
  );
}

/**
 * Core access logic
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
