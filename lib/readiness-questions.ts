export type ReadinessOption = {
  label: string;
  value: string;
  score: number;
};

export type ReadinessQuestion = {
  id: string;
  question: string;
  options: ReadinessOption[];
};

export const readinessQuestions: ReadinessQuestion[] = [
  {
    id: "structure",
    question: "Do you currently have a formal business structure?",
    options: [
      { label: "No structure", value: "none", score: 0 },
      { label: "Sole proprietor", value: "sole", score: 1 },
      { label: "LLC or Corporation", value: "entity", score: 3 }
    ]
  },
  {
    id: "records",
    question: "How organized are your financial records?",
    options: [
      { label: "Not organized", value: "none", score: 0 },
      { label: "Basic tracking", value: "basic", score: 1 },
      { label: "Professional bookkeeping", value: "pro", score: 3 }
    ]
  },
  {
    id: "compliance",
    question: "Are you compliant with tax and regulatory filings?",
    options: [
      { label: "No", value: "no", score: 0 },
      { label: "Partially", value: "partial", score: 1 },
      { label: "Fully compliant", value: "yes", score: 3 }
    ]
  }
];
