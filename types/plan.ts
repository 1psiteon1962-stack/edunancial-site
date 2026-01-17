// types/plan.ts

export type PlanCode = "free" | "starter" | "founder" | "pro" | "elite" | "enterprise";

/**
 * Plan tiers used by level gating and other entitlement checks.
 * Kept identical to PlanCode for simplicity.
 */
export type PlanTier = PlanCode;

const SAFE_PLANS: readonly PlanCode[] = [
  "free",
  "starter",
  "founder",
  "pro",
  "elite",
  "enterprise",
] as const;

export function normalizePlan(plan: string): PlanCode {
  const p = String(plan || "")
    .trim()
    .toLowerCase();

  // common aliases
  if (p === "basic") return "starter";
  if (p === "premium") return "pro";

  if ((SAFE_PLANS as readonly string[]).includes(p)) return p as PlanCode;
  return "free";
}

/**
 * Backwards-compat helper that some files import as `hasAccess`.
 * Compares a user's plan against a required plan.
 */
export function hasAccess(userPlan: PlanCode, required: PlanCode): boolean {
  const order: Record<PlanCode, number> = {
    free: 0,
    starter: 1,
    founder: 2,
    pro: 3,
    elite: 4,
    enterprise: 5,
  };

  return order[userPlan] >= order[required];
}
