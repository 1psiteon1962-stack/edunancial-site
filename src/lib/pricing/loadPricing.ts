// src/lib/pricing/loadPricing.ts

import type { Pricing } from "./types";

import { US_PRICING } from "./us";
import { EUROPE_PRICING } from "./europe";
import { LATAM_PRICING } from "./latam";
import { AFRICA_PRICING } from "./africa";
import { ASIA_PRICING } from "./asia";
import { CARIBBEAN_PRICING } from "./caribbean";
import { MENA_PRICING } from "./mena";
import { OCEANIA_PRICING } from "./oceania";
import { GLOBAL_PRICING } from "./global";

export async function loadPricing(region: string = "us"): Promise<Pricing> {
  switch (region.toLowerCase()) {
    case "us":
      return US_PRICING;

    case "europe":
      return EUROPE_PRICING;

    case "latam":
      return LATAM_PRICING;

    case "africa":
      return AFRICA_PRICING;

    case "asia":
      return ASIA_PRICING;

    case "caribbean":
      return CARIBBEAN_PRICING;

    case "mena":
      return MENA_PRICING;

    case "oceania":
      return OCEANIA_PRICING;

    case "global":
      return GLOBAL_PRICING;

    default:
      return US_PRICING;
  }
}
