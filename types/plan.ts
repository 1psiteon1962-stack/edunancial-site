export type PlanCode = "free" | "starter" | "founder" | "pro";

/**
 * Default plan for unauthenticated users
 */
export const DEFAULT_PLAN: PlanCode = "free";

/**
 * Ordered plans (lowest → highest)
 */
export const PLANS: PlanCode[] = ["free", "starter", "founder", "pro"];

/**
 * Access helper (legacy compatibility)
 */
export function hasAccess(userPlan: PlanCode, required: PlanCode): boolean {
  return PLANS.indexOf(userPlan) >= PLANS.indexOf(required);
}
