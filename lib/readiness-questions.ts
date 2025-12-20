export type ReadinessQuestion = {
  id: string;
  question: string;
  options: { label: string; score: number }[];
};

export const readinessQuestions: ReadinessQuestion[] = [
  {
    id: "income_stability",
    question: "How stable is your current income?",
    options: [
      { label: "Very unstable", score: 0 },
      { label: "Somewhat unstable", score: 1 },
      { label: "Mostly stable", score: 2 },
      { label: "Very stable", score: 3 }
    ]
  },
  {
    id: "emergency_funds",
    question: "How many months of expenses do you have saved?",
    options: [
      { label: "None", score: 0 },
      { label: "1–2 months", score: 1 },
      { label: "3–5 months", score: 2 },
      { label: "6+ months", score: 3 }
    ]
  },
  {
    id: "risk_tolerance",
    question: "How do you react to financial losses?",
    options: [
      { label: "High stress / panic", score: 0 },
      { label: "Strong discomfort", score: 1 },
      { label: "Manageable concern", score: 2 },
      { label: "Calm and analytical", score: 3 }
    ]
  },
  {
    id: "time_commitment",
    question: "How much time can you realistically dedicate weekly?",
    options: [
      { label: "Less than 1 hour", score: 0 },
      { label: "1–3 hours", score: 1 },
      { label: "4–7 hours", score: 2 },
      { label: "8+ hours", score: 3 }
    ]
  },
  {
    id: "structure_awareness",
    question: "How familiar are you with financial or business structures?",
    options: [
      { label: "Not familiar", score: 0 },
      { label: "Basic awareness", score: 1 },
      { label: "Moderate understanding", score: 2 },
      { label: "Strong understanding", score: 3 }
    ]
  }
];
