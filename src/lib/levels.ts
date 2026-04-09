import type { Level } from "./level-offers"

export type LevelDefinition = {
  id: Level
  title: string
  description: string
  requiredPlan: Level
  order: number
}

export const EDUNANCIAL_LEVELS: LevelDefinition[] = [
  {
    id: "starter",
    title: "Starter Level",
    description: "Entry-level tools and basic financial education",
    requiredPlan: "starter",
    order: 1,
  },
  {
    id: "growth",
    title: "Growth Level",
    description: "Scaling systems and structured expansion",
    requiredPlan: "growth",
    order: 2,
  },
  {
    id: "pro",
    title: "Pro Level",
    description: "Advanced tools and analytics",
    requiredPlan: "pro",
    order: 3,
  },
  {
    id: "enterprise",
    title: "Enterprise Level",
    description: "Full-scale systems and governance",
    requiredPlan: "enterprise",
    order: 4,
  },
  {
    id: "elite",
    title: "Elite Level",
    description: "Capital structuring and global scaling",
    requiredPlan: "elite",
    order: 5,
  },
]
