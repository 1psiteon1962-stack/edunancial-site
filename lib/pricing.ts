// lib/pricing.ts

import type { Level } from "./levels";

export function getPricingForLevel(level: Level): number {
  switch (level) {
    case "free":
      return 0;
    case 1:
      return 0;
    case 2:
      return 9;
    case 3:
      return 19;
    case 4:
      return 39;
    case 5:
      return 79;
    default:
      return 0;
  }
}
