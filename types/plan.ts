// ✅ REPLACE ENTIRE FILE: /types/plan.ts

export const PLAN_CODES = [
  "free",
  "starter",
  "founder",
  "pro",
  "elite",
  "enterprise",
] as const;

export type PlanCode = (typeof PLAN_CODES)[number];

// Some parts of your codebase refer to tiers (ex: types/level.ts importing PlanTier)
export type PlanTier = PlanCode;

// Canonical plans registry (some parts import PLANS)
export const PLANS: ReadonlyArray<PlanCode> = [...PLAN_CODES];

// Default plan (some parts import DEFAULT_PLAN)
export const DEFAULT_PLAN: PlanCode = "free";

// Type guard (some parts import isPlanCode)
export function isPlanCode(value: unknown): value is PlanCode {
  return typeof value === "string" && (PLAN_CODES as readonly string[]).includes(value);
}

// Access check (some parts import hasAccess / lib/access/canAccess.ts imports hasAccess)
export function hasAccess(userPlan: PlanCode, required: PlanCode): boolean {
  const rank: Record<PlanCode, number> = {
    free: 0,
    starter: 1,
    founder: 2,
    pro: 3,
    elite: 4,
    enterprise: 5,
  };
  return rank[userPlan] >= rank[required];
}
