// data/curriculumMap.ts

export type CapitalismLevel = 1 | 2 | 3 | 4 | 5;

export interface CurriculumModule {
  level: CapitalismLevel;
  title: string;
  objective: string;
  competencies: string[];
}

export const curriculumMap: CurriculumModule[] = [
  {
    level: 1,
    title: "From Labor to Awareness",
    objective:
      "Understand why trading time for money caps leverage and how systems differ from jobs.",
    competencies: [
      "Income vs wealth",
      "Fiat vs real value",
      "Time limitation",
      "Foundational financial literacy",
    ],
  },
  {
    level: 2,
    title: "Operator Thinking",
    objective:
      "Learn to generate income independently while identifying structural ceilings.",
    competencies: [
      "Cash flow awareness",
      "Basic business models",
      "Cost vs margin",
      "Effort dependency risk",
    ],
  },
  {
    level: 3,
    title: "Founder Architecture",
    objective:
      "Build systems that function without constant personal input.",
    competencies: [
      "Digital leverage",
      "Distribution channels",
      "Validation before capital",
      "System design",
    ],
  },
  {
    level: 4,
    title: "Ownership & Control",
    objective:
      "Control assets, IP, or platforms that others operate within.",
    competencies: [
      "Intellectual property",
      "Corporate structuring",
      "Jurisdictional awareness",
      "Governance over labor",
    ],
  },
  {
    level: 5,
    title: "Capital Architect",
    objective:
      "Design structures that allocate capital, risk, and opportunity for others.",
    competencies: [
      "Capital allocation logic",
      "Consolidation cycles",
      "Optionality design",
      "Long-term dominance strategy",
    ],
  },
];
