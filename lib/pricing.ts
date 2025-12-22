// lib/pricing.ts

import type { Level } from "./levels";

export function getPricingForLevel(level: Level): number {
  switch (level) {
    case "free":
      return 0;

    case "Foundation":
      return 0;

    case "Builder":
      return 9;

    case "Visionary":
      return 19;

    default:
      return 0;
  }
}
