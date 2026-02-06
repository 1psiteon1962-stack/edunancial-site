// src/constants/levels.ts

/**
 * Literacy / education levels
 */
export type LiteracyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

/**
 * Ordered level list
 */
export const LEVELS: readonly LiteracyLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;

/**
 * Level metadata used by pages (REQUIRED)
 */
export const LEVEL_DEFINITIONS: Record<
  LiteracyLevel,
  {
    label: string;
    description: string;
    order: number;
  }
> = {
  beginner: {
    label: "Beginner",
    description: "Foundational financial and economic concepts.",
    order: 1,
  },
  intermediate: {
    label: "Intermediate",
    description: "Applied concepts, real-world use, and risk awareness.",
    order: 2,
  },
  advanced: {
    label: "Advanced",
    description: "Strategic analysis, capital structure, and scaling.",
    order: 3,
  },
  expert: {
    label: "Expert",
    description: "Institutional-level thinking and capital architecture.",
    order: 4,
  },
};

/**
 * Validate a level
 */
export function isLiteracyLevel(value: string): value is LiteracyLevel {
  return (LEVELS as readonly string[]).includes(value);
}

/**
 * Normalize unknown input into a safe level
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
