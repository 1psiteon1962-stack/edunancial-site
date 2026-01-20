export type Plan = {
  id?: string;
  name?: string;
};

export function normalizePlan(plan: unknown): Plan {
  if (typeof plan === "object" && plan !== null) {
    return plan as Plan;
  }
  return {};
}
