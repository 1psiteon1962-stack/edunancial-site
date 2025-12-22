import { Level } from "./levels"

export function getPricingForLevel(level: Level): number {
  switch (level) {
    case Level.Foundation:
      return 0
    case Level.Builder:
      return 9
    case Level.Operator:
      return 19
    case Level.Owner:
      return 49
    case Level.Architect:
      return 99
    default:
      return 0
  }
}
