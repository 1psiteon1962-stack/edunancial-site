// lib/level-guard.ts

import type { LiteracyLevel } from "@/data/levels";

/**
 * Ordered literacy levels from lowest to highest.
 * Kept local to avoid cross-file export mismatch issues.
 */
const ORDERED_LEVELS: LiteracyLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];

/**
 * Returns true if the user's literacy level
 * meets or exceeds the required level.
 */
export function meetsLevel(
  userLevel: LiteracyLevel,
  requiredLevel: LiteracyLevel
): boolean {
  return (
    ORDERED_LEVELS.indexOf(userLevel) >=
    ORDERED_LEVELS.indexOf(requiredLevel)
  );
}
