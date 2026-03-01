import type { Pricing } from "./types";
import { US_PRICING } from "./us";
import { LATAM_PRICING } from "./latam";
import { AFRICA_PRICING } from "./africa";
import { MENA_PRICING } from "./mena";
import { ASIA_PRICING } from "./asia";
import { EU_PRICING } from "./eu";
import { GLOBAL_PRICING } from "./global";

export function loadPricing(region: string): Pricing {
  const slug = (region || "us").toLowerCase().trim();

  switch (slug) {
    case "us":
      return US_PRICING;
    case "latam":
      return LATAM_PRICING;
    case "africa":
      return AFRICA_PRICING;
    case "mena":
      return MENA_PRICING;
    case "asia":
      return ASIA_PRICING;
    case "eu":
      return EU_PRICING;
    default:
      return GLOBAL_PRICING;
  }
}
