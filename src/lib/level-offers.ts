export type EdunancialLevel =
  | "starter"
  | "growth"
  | "pro"
  | "enterprise"
  | "elite"

export type LevelDefinition = {
  id: EdunancialLevel
  title: string
  description: string
  requiredPlan: EdunancialLevel
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
    description: "Scaling systems, structure, and early-stage expansion",
    requiredPlan: "growth",
    order: 2,
  },
  {
    id: "pro",
    title: "Pro Level",
    description: "Advanced tools, analytics, and investment frameworks",
    requiredPlan: "pro",
    order: 3,
  },
  {
    id: "enterprise",
    title: "Enterprise Level",
    description: "Full-scale systems, governance, and multi-market expansion",
    requiredPlan: "enterprise",
    order: 4,
  },
  {
    id: "elite",
    title: "Elite Level",
    description: "Top-tier capital structuring, global scaling, and strategy",
    requiredPlan: "elite",
    order: 5,
  },
]
