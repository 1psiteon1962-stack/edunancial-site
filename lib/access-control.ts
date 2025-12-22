// lib/access-control.ts

import type { Level } from "./levels"
import { hasSufficientLevel } from "./levels"

/**
 * Access rule definition
 */
export type AccessRule = {
  requiredLevel: Level
}

/**
 * Check if a user can access a resource
 */
export function canAccess(
  userLevel: Level,
  rule: AccessRule
): boolean {
  return hasSufficientLevel(userLevel, rule.requiredLevel)
}
