// data/levels.ts

/**
 * LiteracyLevel defines the education difficulty level
 * used across Edunancial product listings.
 *
 * This file MUST export LiteracyLevel because
 * data/products.ts imports it.
 */

export type LiteracyLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

/**
 * Optional display labels (safe helper).
 */
export const literacyLevelLabels: Record<LiteracyLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
