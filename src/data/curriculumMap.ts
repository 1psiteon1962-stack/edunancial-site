export interface CurriculumItem {
  id: string;
  title: string;
  description: string;
  level: number;
}

export const curriculumMap: CurriculumItem[] = [
  {
    id: "foundations",
    title: "Foundations of Financial Literacy",
    description: "Core concepts: money, income, expenses, and discipline.",
    level: 1
  },
  {
    id: "assets",
    title: "Assets vs Liabilities",
    description: "Understanding cash flow and wealth-building fundamentals.",
    level: 2
  },
  {
    id: "business",
    title: "Business & Ownership",
    description: "How businesses generate profit and scale.",
    level: 3
  },
  {
    id: "investing",
    title: "Investing & Capital",
    description: "Risk, return, and long-term capital strategy.",
    level: 4
  }
];
