export interface CurriculumItem {
  id: string;
  level: number;
  title: string;
  objective: string;
  competencies: string[];
}

export const curriculumMap: CurriculumItem[] = [
  {
    id: "foundations",
    level: 1,
    title: "Foundations of Financial Literacy",
    objective:
      "Build disciplined financial habits and understand how money flows in everyday life.",
    competencies: [
      "Income vs expenses",
      "Budgeting fundamentals",
      "Delayed gratification",
      "Financial discipline"
    ]
  },
  {
    id: "assets",
    level: 2,
    title: "Assets vs Liabilities",
    objective:
      "Understand how assets create cash flow and how liabilities drain it.",
    competencies: [
      "Cash flow analysis",
      "Good debt vs bad debt",
      "Balance sheet thinking",
      "Wealth-building mindset"
    ]
  },
  {
    id: "business",
    level: 3,
    title: "Business & Ownership",
    objective:
      "Learn how businesses generate profit and how ownership multiplies income.",
    competencies: [
      "Revenue models",
      "Cost structures",
      "Profit margins",
      "Ownership vs employment"
    ]
  },
  {
    id: "investing",
    level: 4,
    title: "Investing & Capital",
    objective:
      "Apply capital strategically to compound wealth over time while managing risk.",
    competencies: [
      "Risk vs return",
      "Time value of money",
      "Diversification",
      "Long-term investing strategy"
    ]
  }
];
