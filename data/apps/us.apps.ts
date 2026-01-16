import { PlanCode } from "@/types/plan"

export type App = {
  id: string
  name: string
  description: string
  accessLevel: PlanCode
  lastUpdated: string
}

export const US_APPS: App[] = [
  {
    id: "edunancial-core",
    name: "Edunancial Core",
    description: "Financial literacy, investing, and wealth-building education.",
    accessLevel: "free",
    lastUpdated: "2026-01-01"
  },
  {
    id: "capital-stack",
    name: "Capital Stack",
    description: "Deal modeling, funding structures, and investor analytics.",
    accessLevel: "starter",
    lastUpdated: "2026-01-01"
  },
  {
    id: "founder-suite",
    name: "Founder Suite",
    description: "Corporate structuring, compliance, and scale systems.",
    accessLevel: "founder",
    lastUpdated: "2026-01-01"
  },
  {
    id: "global-expansion",
    name: "Global Expansion",
    description: "Cross-border setup, tax planning, and international growth tools.",
    accessLevel: "pro",
    lastUpdated: "2026-01-01"
  },
  {
    id: "elite-intelligence",
    name: "Elite Intelligence",
    description: "Private intelligence, deal flow, and capital syndication.",
    accessLevel: "elite",
    lastUpdated: "2026-01-01"
  }
]
