export const LEVELS = {
  1: { name: "Awareness", desc: "Reactive financial thinking" },
  2: { name: "Understanding", desc: "Recognizing patterns" },
  3: { name: "Structure", desc: "System-based thinking" },
  4: { name: "Strategy", desc: "Scenario comparison" },
  5: { name: "Vision", desc: "Ecosystem and long-term thinking" },
};

export const levelQuestions = [
  {
    text: "When you receive unexpected income, what feels most natural?",
    options: [
      { text: "Cover immediate needs", weight: 1 },
      { text: "Save what I can", weight: 2 },
      { text: "Organize cash flow", weight: 3 },
      { text: "Compare long-term outcomes", weight: 4 },
      { text: "Design scalable systems", weight: 5 },
    ],
  },
  {
    text: "How do you usually think about financial risk?",
    options: [
      { text: "Avoid it whenever possible", weight: 1 },
      { text: "Deal with it when it appears", weight: 2 },
      { text: "Plan for it in advance", weight: 3 },
      { text: "Accept it strategically", weight: 4 },
      { text: "Structure systems around it", weight: 5 },
    ],
  },
  {
    text: "Which statement best reflects your view of money?",
    options: [
      { text: "Money is about survival", weight: 1 },
      { text: "Money provides stability", weight: 2 },
      { text: "Money should be structured", weight: 3 },
      { text: "Money is a strategic resource", weight: 4 },
      { text: "Money enables systems", weight: 5 },
    ],
  },
];
