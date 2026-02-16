// lib/level-guard.ts

import { levels, type LiteracyLevel } from "@/data/levels";

/**
 * Returns true if the user's literacy level meets or exceeds
 * the required level.
 *
 * Order is defined centrally in data/levels.ts
 */
export function meetsLevel(
  userLevel: LiteracyLevel,
  requiredLevel: LiteracyLevel
): boolean {
  const userIndex = levels.indexOf(userLevel);
  const requiredIndex = levels.indexOf(requiredLevel);

  if (userIndex === -1 || requiredIndex === -1) {
    return false;
  }

  return userIndex >= requiredIndex;
}
