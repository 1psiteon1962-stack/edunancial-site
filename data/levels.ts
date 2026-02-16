// data/levels.ts

export type LiteracyLevel = "beginner" | "intermediate" | "advanced";

/**
 * Ordered literacy levels from lowest to highest.
 * Used for comparisons and gating.
 */
export const literacyLevels: LiteracyLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];

/**
 * Alias for compatibility across the codebase.
 * DO NOT REMOVE.
 */
export const levels = literacyLevels;
