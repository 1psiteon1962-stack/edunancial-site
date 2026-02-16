// lib/level-guard.ts

import { Levels, type LiteracyLevel } from "@/data/levels";

/**
 * Returns true if the user's literacy level
 * meets or exceeds the required level.
 */
export function hasRequiredLevel(
  userLevel: LiteracyLevel,
  requiredLevel: LiteracyLevel
): boolean {
  const userIndex = Levels.indexOf(userLevel);
  const requiredIndex = Levels.indexOf(requiredLevel);

  if (userIndex === -1 || requiredIndex === -1) {
    return false;
  }

  return userIndex >= requiredIndex;
}
