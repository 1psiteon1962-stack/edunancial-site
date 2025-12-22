// lib/levels.ts

export type LevelMeta = {
  id: string;
  title: string;
  description: string;
};

export const EDUNANCIAL_LEVELS = [
  {
    id: "free",
    title: "Free",
    description: "Explore public content and learn the basics before upgrading.",
  },
  {
    id: "Foundation",
    title: "Foundation",
    description: "Start here: core concepts, habits, and a clear path forward.",
  },
  {
    id: "Builder",
    title: "Builder",
    description: "Build skill and consistency with structured learning and tools.",
  },
  {
    id: "Visionary",
    title: "Visionary",
    description: "Advanced strategy, systems, and scaling thinking.",
  },
] as const satisfies readonly LevelMeta[];

export type Level = (typeof EDUNANCIAL_LEVELS)[number]["id"];

const LEVEL_ORDER: Record<Level, number> = {
  free: 0,
  Foundation: 1,
  Builder: 2,
  Visionary: 3,
};

export function hasSufficientLevel(required: Level, current: Level): boolean {
  return LEVEL_ORDER[current] >= LEVEL_ORDER[required];
}
