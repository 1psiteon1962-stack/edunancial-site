// lib/accessControl.ts

import { ACCESS_MATRIX, AccessArea } from "@/data/access/accessMatrix";
import { PlanCode } from "@/data/plans/us.plans";

/**
 * Determines whether a given plan can access a given area
 */
export function canAccess(plan: PlanCode, area: AccessArea): boolean {
  return ACCESS_MATRIX[plan]?.includes(area) ?? false;
}
