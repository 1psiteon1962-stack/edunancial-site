export type DiagnosticQuestion = {
  id: string;
  question: string;
  options: {
    label: string;
    value: number;
  }[];
};

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "q1",
    question: "How familiar are you with financial concepts?",
    options: [
      { label: "Beginner", value: 1 },
      { label: "Intermediate", value: 2 },
      { label: "Advanced", value: 3 },
    ],
  },
  {
    id: "q2",
    question: "Do you currently invest or run a business?",
    options: [
      { label: "No", value: 1 },
      { label: "Some experience", value: 2 },
      { label: "Yes, actively", value: 3 },
    ],
  },
  {
    id: "q3",
    question: "What is your primary goal?",
    options: [
      { label: "Learn basics", value: 1 },
      { label: "Grow income", value: 2 },
      { label: "Scale wealth", value: 3 },
    ],
  },
];
