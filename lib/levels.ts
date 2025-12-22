// lib/levels.ts

/**
 * Canonical Edunancial level system
 * This file is the single source of truth.
 */

export type Level =
  | "free"
  | "basic"
  | "premium"
  | "pro"
  | "enterprise"

export type EdunancialLevel = {
  id: Level
  label: string
  description: string
  audience: string
  access: string
  monetization: string
}

/**
 * ORDER MATTERS — lowest to highest
 */
export const EDUNANCIAL_LEVELS: EdunancialLevel[] = [
  {
    id: "free",
    label: "Free",
    description: "Introductory financial literacy and orientation.",
    audience: "Curious beginners",
    access: "Public content, previews",
    monetization: "None",
  },
  {
    id: "basic",
    label: "Basic",
    description: "Foundational education and practical guidance.",
    audience: "New entrepreneurs",
    access: "Core lessons and tools",
    monetization: "Low-cost subscription",
  },
  {
    id: "premium",
    label: "Premium",
    description: "Advanced strategies and structured growth paths.",
    audience: "Scaling founders",
    access: "Advanced modules and frameworks",
    monetization: "Monthly / annual subscription",
  },
  {
    id: "pro",
    label: "Pro",
    description: "Professional-grade systems and deal literacy.",
    audience: "Operators & investors",
    access: "Deal analysis, playbooks, live sessions",
    monetization: "High-tier subscription",
  },
  {
    id: "enterprise",
    label: "Enterprise",
    description: "Institutional-level insight and advisory access.",
    audience: "Firms & serious capital",
    access: "Custom access & advisory",
    monetization: "Contract / bespoke pricing",
  },
]

export const LEVEL_ORDER: Level[] = EDUNANCIAL_LEVELS.map(l => l.id)

/**
 * Utility: permission check
 */
export function hasSufficientLevel(
  userLevel: Level,
  requiredLevel: Level
): boolean {
  return (
    LEVEL_ORDER.indexOf(userLevel) >=
    LEVEL_ORDER.indexOf(requiredLevel)
  )
}
