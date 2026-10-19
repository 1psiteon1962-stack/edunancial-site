import { getCountryArchitecture } from "@/lib/regions/architecture";

import pricingData from "./country-pricing-data.json";

/**
 * Owner-approved country pricing formula (approved 2026-10-19):
 *
 *   local price = US price x affordability factor (World Bank income group)
 *                 x planning exchange rate, rounded to a clean local price.
 *
 * Once approved, the formula applies automatically to every country without a
 * hand-set price. Hand-set (approved) country prices in country-price-table.ts
 * always win. US and Canada keep their existing prices and checkout unchanged.
 * Exchange rates are a dated planning snapshot (country-pricing-data.json),
 * not a live quote on each page view.
 */

export type IncomeGroup = "HIC" | "UMC" | "LMC" | "LIC";
export type FormulaPlanId = "basic" | "premium" | "enterprise";

export const AFFORDABILITY_FACTORS: Record<IncomeGroup, number> = {
  HIC: 1.0,
  UMC: 0.45,
  LMC: 0.3,
  LIC: 0.2,
};

/** US master prices (USD). Must match src/types/membership.ts. */
export const US_MASTER_PRICES: Record<FormulaPlanId, { monthly: number; annual: number }> = {
  basic: { monthly: 14.99, annual: 119.99 },
  premium: { monthly: 24.99, annual: 199.99 },
  enterprise: { monthly: 39.99, annual: 299.99 },
};

/** Countries that keep their existing (pre-formula) pricing behavior. */
export const FORMULA_EXEMPT_COUNTRIES = new Set(["US", "CA"]);

type CountryRow = { i: string; c: string };
const COUNTRIES = pricingData.countries as Record<string, CountryRow>;
const USD_RATES = pricingData.usdRates as Record<string, number>;

export const PRICING_DATA_AS_OF: string = pricingData.asOf;

/** Clean retail rounding: under 100 ends in .99; 100-999 ends in 9; 1,000-99,999 ends in 99; above ends in 999. */
export function roundToCleanPrice(value: number): number {
  if (!(value > 0)) return 0;
  if (value < 100) return Number((Math.max(1, Math.round(value)) - 0.01).toFixed(2));
  if (value < 1000) return Math.round(value / 10) * 10 - 1;
  if (value < 100000) return Math.round(value / 100) * 100 - 1;
  return Math.round(value / 1000) * 1000 - 1;
}

export interface FormulaCountryPricing {
  countryCode: string;
  currency: string;
  incomeGroup: IncomeGroup;
  factor: number;
  usdRate: number;
  asOf: string;
  plans: Record<FormulaPlanId, { monthly: number; annual: number }>;
  /** True only when the visitor would be charged exactly the US checkout amount in USD. */
  matchesUsCheckout: boolean;
}

export function getFormulaCountryPricing(countryCode: string | null | undefined): FormulaCountryPricing | null {
  const code = String(countryCode ?? "").trim().toUpperCase();
  if (!code || FORMULA_EXEMPT_COUNTRIES.has(code)) return null;
  const row = COUNTRIES[code];
  if (!row) return null;
  // Countries turned off in the regional registry (e.g. Cuba: sanctions) never get prices.
  const configured = getCountryArchitecture(code);
  const configuredState = configured ? configured.country.launchState ?? configured.region.launchState : null;
  if (configuredState === "DISABLED") return null;
  const incomeGroup = row.i as IncomeGroup;
  const factor = AFFORDABILITY_FACTORS[incomeGroup];
  const usdRate = USD_RATES[row.c];
  if (factor === undefined || !(usdRate > 0)) return null;

  const isUsdAtFullPrice = row.c === "USD" && factor === 1;
  const plans = {} as Record<FormulaPlanId, { monthly: number; annual: number }>;
  for (const plan of Object.keys(US_MASTER_PRICES) as FormulaPlanId[]) {
    const us = US_MASTER_PRICES[plan];
    plans[plan] = isUsdAtFullPrice
      ? { ...us }
      : {
          monthly: roundToCleanPrice(us.monthly * factor * usdRate),
          annual: roundToCleanPrice(us.annual * factor * usdRate),
        };
  }

  return {
    countryCode: code,
    currency: row.c,
    incomeGroup,
    factor,
    usdRate,
    asOf: PRICING_DATA_AS_OF,
    plans,
    matchesUsCheckout: isUsdAtFullPrice,
  };
}
