import type { PlanTier } from "../types/plan";

export const DEFAULT_PLAN: PlanTier = "free";

/**
 * Temporary plan resolver.
 * Replace later with real auth/subscription lookup (Stripe/PayPal/Square/etc).
 */
export function getActivePlan(): PlanTier {
  // If you want a quick manual override in production without auth:
  // set NEXT_PUBLIC_PLAN=free|starter|pro|elite in Netlify env vars
  const env = (process.env.NEXT_PUBLIC_PLAN || "").trim();
  if (env === "free" || env === "starter" || env === "pro" || env === "elite") return env;
  return DEFAULT_PLAN;
}

export function planRank(plan: PlanTier): number {
  switch (plan) {
    case "free":
      return 0;
    case "starter":
      return 1;
    case "pro":
      return 2;
    case "elite":
      return 3;
    default: {
      const _exhaustive: never = plan;
      return _exhaustive;
    }
  }
}

export function canAccess(required: PlanTier, active: PlanTier): boolean {
  return planRank(active) >= planRank(required);
}
