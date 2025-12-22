// lib/levels.ts

export enum Level {
  Foundation = "FOUNDATION",
  Builder = "BUILDER",
  Operator = "OPERATOR",
  Owner = "OWNER",
  Architect = "ARCHITECT",
}

export type LevelMeta = {
  id: Level
  title: string
  description: string
  order: number
}

export const EDUNANCIAL_LEVELS: LevelMeta[] = [
  {
    id: Level.Foundation,
    title: "Foundation",
    description: "Learn the fundamentals of money, assets, and basic financial literacy.",
    order: 1,
  },
  {
    id: Level.Builder,
    title: "Builder",
    description: "Start building income streams and understanding leverage.",
    order: 2,
  },
  {
    id: Level.Operator,
    title: "Operator",
    description: "Operate businesses, systems, and investments with intent.",
    order: 3,
  },
  {
    id: Level.Owner,
    title: "Owner",
    description: "Own scalable assets, teams, and capital structures.",
    order: 4,
  },
  {
    id: Level.Architect,
    title: "Architect",
    description: "Design systems, capital flows, and long-term strategy.",
    order: 5,
  },
]
