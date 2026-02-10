export type ReadinessOption = {
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
    question: "Do you currently operate with formal business structure?",
    options: [
      { label: "No structure", score: 0 },
      { label: "Some structure", score: 10 },
      { label: "Fully structured", score: 20 }
    ]
  },
  {
    id: "systems",
    question: "Do you have repeatable systems in place?",
    options: [
      { label: "None", score: 0 },
      { label: "Some", score: 10 },
      { label: "Documented & repeatable", score: 20 }
    ]
  },
  {
    id: "financials",
    question: "Do you have clean, trackable financials?",
    options: [
      { label: "No", score: 0 },
      { label: "Partial", score: 10 },
      { label: "Auditable / clean", score: 20 }
    ]
  }
];
