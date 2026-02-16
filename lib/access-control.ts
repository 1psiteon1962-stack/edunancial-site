// lib/access-control.ts

import { ACCESS_MATRIX, AccessArea, PlanCode } from "@/data/access/accessMatrix";

/**
 * Determines whether a given plan can access a given area
 */
export function canAccess(
  plan: PlanCode,
  area: AccessArea
): boolean {
  return ACCESS_MATRIX[plan]?.includes(area) ?? false;
}
