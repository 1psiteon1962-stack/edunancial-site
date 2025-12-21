// lib/levels.ts

export const LEVEL_META = {
  1: {
    label: "Awareness",
    description: "Basic exposure to financial concepts",
    monetizable: false,
  },
  2: {
    label: "Foundation",
    description: "Understands core financial principles",
    monetizable: false,
  },
  3: {
    label: "Application",
    description: "Applies financial knowledge in real situations",
    monetizable: true,
  },
  4: {
    label: "Optimization",
    description: "Optimizes strategies and manages risk",
    monetizable: true,
  },
  5: {
    label: "Architect",
    description: "Designs systems, mentors others, builds wealth engines",
    monetizable: true,
  },
} as const;

/**
 * Canonical literacy level (1–5)
 */
export type LiteracyLevel = keyof typeof LEVEL_META;

/**
 * Strongly typed level object
 */
export type LevelMeta = typeof LEVEL_META[LiteracyLevel];

/**
 * Label shortcut
 */
export const LEVEL_LABELS: Record<LiteracyLevel, string> = {
  1: "Awareness",
  2: "Foundation",
  3: "Application",
  4: "Optimization",
  5: "Architect",
};
