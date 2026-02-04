// lib/level-guard.ts

import { Levels, type LiteracyLevel } from "@/data/levels";

/**
 * Returns true if the user's literacy level meets or exceeds
 * the required level for an app/product.
 */
export function canAccessApp(
  userLevel: LiteracyLevel,
  requiredLevel: LiteracyLevel
): boolean {
  return Levels.indexOf(userLevel) >= Levels.indexOf(requiredLevel);
}

/**
 * Returns true if the user has access to capital-level features
 * (advanced monetization, investor tools, PE readiness).
 *
 * Capital access is granted at "advanced" level.
 */
export function hasCapitalAccess(userLevel: LiteracyLevel): boolean {
  return userLevel === "advanced";
}
