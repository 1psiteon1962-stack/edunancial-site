import { LevelId } from "./levels";

/**
 * Centralized pricing logic aligned with LevelId
 */
export function getPricingForLevel(level: LevelId): number {
  switch (level) {
    case "free":
      return 0;

    case "starter":
      return 9;

    case "builder":
      return 29;

    case "operator":
      return 99;

    case "owner":
      return 299;

    case "investor":
      return 999;

    default:
      return 0;
  }
}
