export type CurriculumItem = {
  level: number;
  title: string;
  objective: string;
  competencies: string[];
};

export const curriculumMap: CurriculumItem[] = [
  {
    level: 1,
    title: "Foundation",
    objective: "Establish basic structure, records, and compliance habits.",
    competencies: ["Entity basics", "Tracking income/expenses", "Routine compliance calendar"]
  },
  {
    level: 2,
    title: "Operations",
    objective: "Build repeatable systems and simple controls.",
    competencies: ["Checklists", "Process documentation", "Basic KPI tracking"]
  },
  {
    level: 3,
    title: "Scaling",
    objective: "Improve governance, contracts, and risk posture for growth.",
    competencies: ["Standard agreements", "Role clarity", "Risk mitigation systems"]
  }
];
