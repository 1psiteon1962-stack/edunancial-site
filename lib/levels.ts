// lib/levels.ts

export const LEVEL_META = {
  1: {
    label: "Awareness",
    description: "Basic exposure to financial concepts",
  },
  2: {
    label: "Foundation",
    description: "Understands core financial principles",
  },
  3: {
    label: "Application",
    description: "Applies financial knowledge in real situations",
  },
  4: {
    label: "Optimization",
    description: "Optimizes strategies and manages risk",
  },
  5: {
    label: "Architect",
    description: "Designs systems, mentors others, builds wealth engines",
  },
} as const;

/**
 * Canonical literacy level type
 * (THIS is what pages import)
 */
export type LiteracyLevel = keyof typeof LEVEL_META;

/**
 * Labels shortcut (used by LevelGate, UI, etc.)
 */
export const LEVEL_LABELS: Record<LiteracyLevel, string> = {
  1: "Awareness",
  2: "Foundation",
  3: "Application",
  4: "Optimization",
  5: "Architect",
};
