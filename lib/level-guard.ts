// lib/level-guard.ts

/**
 * Canonical literacy levels used across the platform.
 * Defined locally to avoid cross-file export drift.
 */
export type LiteracyLevel = "beginner" | "intermediate" | "advanced";

/**
 * Ordered literacy levels from lowest to highest.
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
