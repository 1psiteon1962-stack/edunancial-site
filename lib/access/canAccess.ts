import type { PlanCode } from "@/types/plan";

/**
 * Access rules by area
 */
const accessMatrix: Record<string, PlanCode[]> = {
  public: ["starter", "founder", "pro"],
  starter: ["starter", "founder", "pro"],
  founder: ["founder", "pro"],
  pro: ["pro"],
  admin: ["pro"],
};

/**
 * Determine whether a user plan can access a given area
 */
export function canAccess(userPlan: PlanCode, area: string): boolean {
  const allowedPlans = accessMatrix[area];

  if (!allowedPlans) {
    return false;
  }

  return allowedPlans.includes(userPlan);
}
