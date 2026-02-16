// data/levels.ts

/**
 * Canonical literacy levels used across the app.
 * SINGLE SOURCE OF TRUTH.
 *
 * Supports BOTH:
 * - semantic product levels (beginner / intermediate / advanced)
 * - system levels (LEVEL0–LEVEL4)
 */

export type LiteracyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "LEVEL0"
  | "LEVEL1"
  | "LEVEL2"
  | "LEVEL3"
  | "LEVEL4";

/**
 * Ordered list of levels from lowest to highest.
 * Used for comparisons and gating.
 */
export const levels: readonly LiteracyLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "LEVEL0",
  "LEVEL1",
  "LEVEL2",
  "LEVEL3",
  "LEVEL4",
];

/**
 * Backwards-compatible named export
 * REQUIRED by lib/level-guard.ts
 */
export const Levels = levels;
