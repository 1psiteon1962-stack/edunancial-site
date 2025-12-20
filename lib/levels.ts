// lib/levels.ts
// Canonical Edunancial level system

export type Level =
  | 1 // Foundation
  | 2 // Builder
  | 3 // Operator
  | 4 // Wealth Strategist
  | 5; // Capital Architect

export const LEVEL_LABELS: Record<Level, string> = {
  1: "Foundation",
  2: "Builder",
  3: "Operator",
  4: "Wealth Strategist",
  5: "Capital Architect"
};
