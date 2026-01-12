import { ACCESS_MATRIX, AccessArea } from "@/data/access/accessMatrix";
import { PlanCode } from "@/data/plans/us.plans";

export function canAccess(plan: PlanCode, area: AccessArea): boolean {
  return ACCESS_MATRIX[plan]?.includes(area) ?? false;
}
