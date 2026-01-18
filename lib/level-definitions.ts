export interface LevelDefinition {
  level: number;
  title: string;
  description: string;
  indicators: string[];
}

export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  {
    level: 1,
    title: "Survival",
    description: "Operating without structure, predictability, or scale.",
    indicators: [
      "No formal entity",
      "Income is inconsistent",
      "Founder does everything",
      "No KPIs or reporting",
    ],
  },
  {
    level: 2,
    title: "Lifestyle",
    description: "Business supports the founder but does not scale.",
    indicators: [
      "Some repeat revenue",
      "Basic legal structure",
      "Limited delegation",
      "Revenue tied to founder’s time",
    ],
  },
  {
    level: 3,
    title: "Wealth-Building",
    description: "Systems exist and revenue compounds.",
    indicators: [
      "Documented processes",
      "Delegated roles",
      "Measurable KPIs",
      "Predictable cash flow",
    ],
  },
  {
    level: 4,
    title: "Empire Builder",
    description: "The business operates independently of the founder.",
    indicators: [
      "Management layers",
      "Multiple revenue streams",
      "Geographic or vertical expansion",
      "Strong governance",
    ],
  },
  {
    level: 5,
    title: "Capital Architect",
    description: "The business is a capital engine, not an occupation.",
    indicators: [
      "Investor-grade reporting",
      "M&A or roll-up strategy",
      "Licensable or sellable model",
      "Capital markets alignment",
    ],
  },
];
