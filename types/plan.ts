export type PlanCode =
  | "free"
  | "starter"
  | "founder"
  | "pro"
  | "elite";

/**
 * Default plan for unauthenticated users
 */
export const DEFAULT_PLAN: PlanCode = "free";

/**
 * Ordered plans (lowest → highest)
 * IMPORTANT: order defines access hierarchy
 */
export const PLANS: PlanCode[] = [
  "free",
  "starter",
  "founder",
  "pro",
  "elite",
];

/**
 * Access helper
 */
export function hasAccess(
  userPlan: PlanCode,
  required: PlanCode
): boolean {
  return PLANS.indexOf(userPlan) >= PLANS.indexOf(required);
}
