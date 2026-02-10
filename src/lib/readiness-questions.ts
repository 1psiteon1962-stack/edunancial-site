export type ReadinessOption = {
  label: string;
  weight: number;
};

export type ReadinessQuestion = {
  id: string;

  // BOTH are supported to prevent build churn
  prompt: string;
  question: string;

  options: ReadinessOption[];
};

export const readinessQuestions: ReadinessQuestion[] = [
  {
    id: "structure",
    prompt: "Do you currently operate with formal business structure?",
    question: "Do you currently operate with formal business structure?",
    options: [
      { label: "No structure", weight: 0 },
      { label: "Some structure", weight: 1 },
      { label: "Fully structured", weight: 2 }
    ]
  },
  {
    id: "systems",
    prompt: "Do you have repeatable systems in place?",
    question: "Do you have repeatable systems in place?",
    options: [
      { label: "None", weight: 0 },
      { label: "Some", weight: 1 },
      { label: "Documented & repeatable", weight: 2 }
    ]
  }
];
