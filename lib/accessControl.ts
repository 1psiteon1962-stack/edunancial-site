// lib/accessControl.ts

import { ACCESS_MATRIX } from "@/data/access/accessMatrix";
import type { PlanCode, AccessArea } from "@/data/access/accessMatrix";

/**
 * Determines whether a given plan can access a given area
 */
export function canAccess(
  plan: PlanCode,
  area: AccessArea
): boolean {
  const allowed: AccessArea[] = ACCESS_MATRIX[plan] ?? [];
  return allowed.includes(area);
}
