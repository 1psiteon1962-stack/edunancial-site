// lib/levels.ts

/**
 * Canonical level system for Edunancial
 * This file is the SINGLE source of truth.
 */

export type Level =
  | "free"
  | "basic"
  | "premium"
  | "pro"
  | "enterprise"

export const LEVEL_ORDER: Level[] = [
  "free",
  "basic",
  "premium",
  "pro",
  "enterprise",
]

export const LEVEL_LABELS: Record<Level, string> = {
  free: "Free",
  basic: "Basic",
  premium: "Premium",
  pro: "Pro",
  enterprise: "Enterprise",
}

/**
 * Utility: compare levels
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
