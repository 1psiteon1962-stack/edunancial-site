export type PlanTier = "free" | "starter" | "pro" | "elite";

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  elite: "Elite",
};

export const PLAN_ORDER: PlanTier[] = ["free", "starter", "pro", "elite"];
