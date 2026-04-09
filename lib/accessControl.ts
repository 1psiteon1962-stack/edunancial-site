import { ACCESS_MATRIX, PlanCode, AccessArea } from "@/data/access/accessMatrix";

/**
 * Check if a given plan has access to a specific area
 */
export function hasAccess(
  plan: PlanCode,
  area: AccessArea
): boolean {
  const allowedAreas = ACCESS_MATRIX[plan] || [];
  return allowedAreas.includes(area);
}

/**
 * Get all areas accessible for a given plan
 */
export function getAccessAreas(plan: PlanCode): AccessArea[] {
  return ACCESS_MATRIX[plan] || [];
}
