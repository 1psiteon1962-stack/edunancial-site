// types/plan.ts

/**
 * PLAN CODES — used by AccessGate, access control, apps pages
 */
export type PlanCode =
  | "free"
  | "basic"
  | "pro"
  | "premium"
  | "enterprise"
  | "founder"
  | "elite";

/**
 * PLAN TIERS — used by types/level.ts
 * (tiers can map to multiple plan codes)
 */
export type PlanTier =
  | "starter"
  | "growth"
  | "business"
  | "institutional";

/**
 * Canonical list of plan codes
 */
export const PLANS: readonly PlanCode[] = [
  "free",
  "basic",
  "pro",
  "premium",
  "enterprise",
  "founder",
  "elite",
] as const;

/**
 * Default plan
 */
export const DEFAULT_PLAN: PlanCode = "free";

/**
 * Type guard for plan codes
 */
export function isPlanCode(value: unknown): value is PlanCode {
  return typeof value === "string" && PLANS.includes(value as PlanCode);
}

/**
 * Plan → Tier mapping
 */
export const PLAN_TIER_MAP: Record<PlanCode, PlanTier> = {
  free: "starter",
  basic: "starter",
  pro: "growth",
  premium: "growth",
  enterprise: "business",
  founder: "institutional",
  elite: "institutional",
};

/**
 * Normalize arbitrary input to a valid plan
 */
export function normalizePlan(value: unknown): PlanCode {
  if (isPlanCode(value)) return value;
  return DEFAULT_PLAN;
}
