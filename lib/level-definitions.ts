export type LevelDefinition = {
  level: string;
  title: string;
  description: string;
};

export const LEVEL_DEFINITIONS: Record<string, LevelDefinition> = {
  "level-1": {
    level: "level-1",
    title: "Survival",
    description: "Income replacement and cash stability"
  },
  "level-2": {
    level: "level-2",
    title: "Stability",
    description: "Consistent earnings and systemization"
  },
  "level-3": {
    level: "level-3",
    title: "Scale",
    description: "Growth beyond owner dependency"
  },
  "level-4": {
    level: "level-4",
    title: "Capital",
    description: "Asset leverage and investment readiness"
  },
  "level-5": {
    level: "level-5",
    title: "Architecture",
    description: "Portfolio and governance design"
  }
};
