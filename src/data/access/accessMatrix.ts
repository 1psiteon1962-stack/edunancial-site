export type PlanCode = "free" | "starter" | "growth" | "enterprise";

export type AccessArea =
  | "dashboard"
  | "courses"
  | "analytics"
  | "admin"
  | "kpi";

export const ACCESS_MATRIX: Record<PlanCode, AccessArea[]> = {
  free: ["dashboard"],
  starter: ["dashboard", "courses"],
  growth: ["dashboard", "courses", "analytics"],
  enterprise: ["dashboard", "courses", "analytics", "admin", "kpi"],
};
