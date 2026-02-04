// data/levels.ts

/**
 * Literacy levels used across products, apps, and guards.
 * This module MUST export:
 *  - LiteracyLevel (type)
 *  - Levels (constant)
 */

export type LiteracyLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

/**
 * Levels constant required by lib/level-guard.ts
 */
export const Levels: LiteracyLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];

/**
 * Optional display labels.
 */
export const literacyLevelLabels: Record<LiteracyLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
