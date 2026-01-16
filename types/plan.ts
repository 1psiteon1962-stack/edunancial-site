export const PLAN_CODES = [
  "free",
  "starter",
  "founder",
  "pro",
  "elite",
  "enterprise",
] as const;

export type PlanCode = (typeof PLAN_CODES)[number];
export type PlanTier = PlanCode;

export const DEFAULT_PLAN: PlanCode = "free";

export function isPlanCode(value: unknown): value is PlanCode {
  return typeof value === "string" && (PLAN_CODES as readonly string[]).includes(value);
}

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
