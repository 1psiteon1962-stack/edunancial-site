// src/constants/levels.ts

/**
 * Literacy / education levels (single source of truth)
 */
export type LiteracyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

/**
 * Ordered level hierarchy
 */
export const LEVELS: readonly LiteracyLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;

/**
 * Utility: validate a level string
 */
export function isLiteracyLevel(value: string): value is LiteracyLevel {
  return (LEVELS as readonly string[]).includes(value);
}

/**
 * Utility: normalize any incoming level
 */
export function normalizeLevel(
  value: string | null | undefined
): LiteracyLevel {
  if (!value) return "beginner";

  const v = value.toLowerCase();

  if (v === "intermediate") return "intermediate";
  if (v === "advanced") return "advanced";
  if (v === "expert") return "expert";

  return "beginner";
}
