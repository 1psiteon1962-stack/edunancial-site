export type LiteracyLevel = 1 | 2 | 3 | 4 | 5;

export const LEVEL_META: Record<LiteracyLevel, {
  label: string;
  description: string;
  monetizable: boolean;
}> = {
  1: {
    label: "Awareness",
    description: "Basic understanding of money and financial terms.",
    monetizable: false,
  },
  2: {
    label: "Stability",
    description: "Income control, budgeting, and financial discipline.",
    monetizable: false,
  },
  3: {
    label: "Builder",
    description: "Entrepreneurship, ownership, and capital formation.",
    monetizable: true,
  },
  4: {
    label: "Scaler",
    description: "Systems, leverage, and multi-entity strategy.",
    monetizable: true,
  },
  5: {
    label: "Capital Architect",
    description: "Capital allocation, governance, and legacy structures.",
    monetizable: true,
  },
};
