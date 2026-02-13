// lib/readiness-questions.ts

export type ReadinessOption = {
  value: string;
  label: string;
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
    question: "Do you have a formal business structure?",
    options: [
      { value: "none", label: "No structure", score: 0 },
      { value: "basic", label: "Basic (LLC only)", score: 1 },
      { value: "formal", label: "Formal & documented", score: 2 },
    ],
  },
  {
    id: "finance",
    question: "How organized are your finances?",
    options: [
      { value: "none", label: "Not organized", score: 0 },
      { value: "some", label: "Some tracking", score: 1 },
      { value: "full", label: "Fully tracked & separated", score: 2 },
    ],
  },
  {
    id: "risk",
    question: "How well is your business legally protected?",
    options: [
      { value: "none", label: "No protection", score: 0 },
      { value: "partial", label: "Some contracts / insurance", score: 1 },
      { value: "full", label: "Contracts, insurance, compliance", score: 2 },
    ],
  },
];
