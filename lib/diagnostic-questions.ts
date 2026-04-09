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
    question: "How familiar are you with financial systems?",
    options: [
      { label: "Beginner", value: 1 },
      { label: "Intermediate", value: 2 },
      { label: "Advanced", value: 3 }
    ]
  },
  {
    id: "q2",
    question: "Do you currently generate income outside a job?",
    options: [
      { label: "No", value: 1 },
      { label: "Somewhat", value: 2 },
      { label: "Yes", value: 3 }
    ]
  },
  {
    id: "q3",
    question: "What is your primary goal?",
    options: [
      { label: "Learn", value: 1 },
      { label: "Earn", value: 2 },
      { label: "Scale", value: 3 }
    ]
  }
];
