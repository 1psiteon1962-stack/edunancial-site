export type LevelDefinition = {
  level: string;
  title: string;
  description: string;
};

export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  { level: "1", title: "Level 1", description: "Introductory" },
  { level: "2", title: "Level 2", description: "Intermediate" },
  { level: "3", title: "Level 3", description: "Advanced" },
  { level: "4", title: "Level 4", description: "Professional" },
  { level: "5", title: "Level 5", description: "Enterprise" }
];
