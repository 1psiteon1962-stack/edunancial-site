import type { LevelDefinition } from "@/types/level";

export const US_LEVELS: LevelDefinition[] = [
  {
    id: "level-1",
    code: "level-1",
    title: "Level 1 – Foundations",
    description:
      "Basic financial literacy. Understanding money, income, and simple decision-making.",
    outcomes: [
      "Understand what money represents",
      "Recognize income versus expenses",
      "Build basic financial awareness"
    ],
  },
  {
    id: "level-2",
    code: "level-2",
    title: "Level 2 – Growth",
    description:
      "Learning how assets grow over time and how risk and reward interact.",
    outcomes: [
      "Understand compounding",
      "Recognize growth risks",
      "Appreciate long-term planning"
    ],
  },
  {
    id: "level-3",
    code: "level-3",
    title: "Level 3 – Ownership",
    description:
      "Introduction to ownership through real estate, businesses, and paper assets.",
    outcomes: [
      "Understand ownership versus labor",
      "Identify income-producing assets",
      "Recognize leverage and responsibility"
    ],
  },
  {
    id: "level-4",
    code: "level-4",
    title: "Level 4 – Structure",
    description:
      "Using systems, entities, and strategy to protect and scale wealth.",
    outcomes: [
      "Understand structural protection",
      "Recognize entity-level planning",
      "Appreciate scalability concepts"
    ],
  },
  {
    id: "level-5",
    code: "level-5",
    title: "Level 5 – Strategy",
    description:
      "High-level thinking about capital allocation, risk control, and long-term positioning.",
    outcomes: [
      "Think strategically about capital",
      "Understand downside protection",
      "Recognize long-term positioning"
    ],
  },
];
