// ======================================================
// AFRICA REGIONAL FOUNDATION
// pricing.ts – Regional pricing engine configuration
// References the shared Pricing type from src/lib/pricing/types.ts
// and builds per-sub-region overrides on top of the base
// Africa pricing defined in src/lib/pricing/africa.ts.
// ======================================================

import type { Pricing } from "@/lib/pricing/types";
import { AFRICA_PRICING } from "@/lib/pricing/africa";

export type AfricaPricingTier =
  | "entry"
  | "core"
  | "pro";

export interface AfricaSubRegionPricing {
  subRegion: string;
  /** ISO-4217 currency code used for checkout */
  currency: string;
  /** Pricing override; falls back to AFRICA_PRICING when undefined */
  pricing: Pricing;
  /** Whether purchasing in local currency is supported */
  localCurrencyEnabled: boolean;
}

/**
 * Sub-region pricing overrides.
 * Each entry can customise currency and price points for a sub-region.
 * Falls back to the base AFRICA_PRICING for any unspecified sub-region.
 */
export const AFRICA_SUBREGION_PRICING: AfricaSubRegionPricing[] = [
  {
    subRegion: "northern-africa",
    currency: "USD",
    pricing: AFRICA_PRICING,
    localCurrencyEnabled: false,
  },
  {
    subRegion: "eastern-africa",
    currency: "USD",
    pricing: AFRICA_PRICING,
    localCurrencyEnabled: false,
  },
  {
    subRegion: "western-africa",
    currency: "USD",
    pricing: AFRICA_PRICING,
    localCurrencyEnabled: false,
  },
  {
    subRegion: "central-africa",
    currency: "USD",
    pricing: AFRICA_PRICING,
    localCurrencyEnabled: false,
  },
  {
    subRegion: "southern-africa",
    currency: "USD",
    pricing: AFRICA_PRICING,
    localCurrencyEnabled: false,
  },
];

/** Retrieve pricing config for a given sub-region, or fall back to base. */
export function getPricingForSubRegion(subRegion: string): Pricing {
  const match = AFRICA_SUBREGION_PRICING.find(
    (r) => r.subRegion === subRegion
  );
  return match ? match.pricing : AFRICA_PRICING;
}

/** Retrieve the price (in USD) for a given tier. */
export function getAfricaPrice(tier: AfricaPricingTier): number {
  const product = AFRICA_PRICING.products.find((p) => p.sku === tier);
  return product ? product.price : 0;
}
