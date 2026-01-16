import type { PlanCode } from "@/types/plan";

/**
 * Central access-control rule.
 * Keep this SIMPLE and explicit.
 */
export function canAccess(
  userPlan: PlanCode,
  area: string
): boolean {
  // Free users get only public areas
  if (userPlan === "free") {
    return area === "public";
  }

  // Builder gets everything except admin-only
  if (userPlan === "builder") {
    return area !== "admin";
  }

  // Founder / higher plans get full access
  return true;
}
