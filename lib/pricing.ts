// lib/pricing.ts

import { Level } from "./levels"

type PricingTable = {
  [region: string]: {
    [level: string]: number
  }
}

const PRICING_TABLE: PricingTable = {
  US: {
    1: 0,
    2: 9,
    3: 19,
    4: 49,
    5: 99,
  },
  PR: {
    1: 0,
    2: 7,
    3: 15,
    4: 39,
    5: 79,
  },
  DR: {
    1: 0,
    2: 6,
    3: 14,
    4: 35,
    5: 75,
  },
  LATAM: {
    1: 0,
    2: 5,
    3: 12,
    4: 30,
    5: 70,
  },
  EU: {
    1: 0,
    2: 10,
    3: 22,
    4: 55,
    5: 110,
  },
}

export function getPricingForLevel(
  level: Level,
  region: string
): number {
  const regionPricing = PRICING_TABLE[region] ?? PRICING_TABLE.US
  return regionPricing[String(level)] ?? 0
}
