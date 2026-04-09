export type Level = "starter" | "growth" | "enterprise";

export interface LevelConfig {
  id: Level;
  title: string;
  description: string;
}

export const EDUNANCIAL_LEVELS: LevelConfig[] = [
  {
    id: "starter",
    title: "Starter",
    description: "Foundation level",
  },
  {
    id: "growth",
    title: "Growth",
    description: "Scaling level",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    description: "Advanced level",
  },
];
