/**
 * Central country price table (display). One entry per country; adding a
 * country requires only a new entry here. Prices are approved, country-specific
 * amounts in the local currency. They are NOT exchange-rate conversions of US
 * prices.
 *
 * checkoutEnabled stays false until the payment processor can charge exactly
 * the displayed currency and amount. While false, the pricing page shows the
 * local price and states that purchase is not yet open in that country. It
 * never shows a buy button that would charge a different (USD) amount.
 */
import { getFormulaCountryPricing } from "./country-pricing-formula";

export type CountryPriceStatus = "DRAFT" | "APPROVED" | "ACTIVE" | "FORMULA";
export type CountryPricedPlanId = "basic" | "premium" | "enterprise";

export interface CountryPlanPrices {
  monthly: number;
  annual: number;
}

export interface CountryPriceEntry {
  countryCode: string;
  currency: string;
  formatLocale: string;
  status: CountryPriceStatus;
  version: string;
  effectiveDate: string;
  approvedBy: string;
  checkoutEnabled: boolean;
  plans: Record<CountryPricedPlanId, CountryPlanPrices>;
}

export const COUNTRY_PRICE_TABLE: Record<string, CountryPriceEntry> = {
  DO: {
    countryCode: "DO",
    currency: "DOP",
    formatLocale: "es-DO",
    status: "APPROVED",
    version: "do-pilot-v1",
    effectiveDate: "2026-10-19",
    approvedBy: "owner (2026-10-19)",
    checkoutEnabled: false,
    plans: {
      basic: { monthly: 399, annual: 3199 },
      premium: { monthly: 699, annual: 5599 },
      // Annual = 7.5 x monthly, matching the US Gold relationship ($299.99 vs $39.99).
      enterprise: { monthly: 999, annual: 7499 },
    },
  },
};

/**
 * Prices shown to a visitor from this country:
 *   1. a hand-set APPROVED/ACTIVE entry in COUNTRY_PRICE_TABLE, otherwise
 *   2. the owner-approved pricing formula (country-pricing-formula.ts).
 * Returns null for US/CA (existing pricing unchanged) and for countries the
 * formula cannot price (no currency/rate, or excluded jurisdictions).
 */
export function getDisplayCountryPrices(countryCode: string | null | undefined): CountryPriceEntry | null {
  const code = String(countryCode ?? "").trim().toUpperCase();
  const entry = COUNTRY_PRICE_TABLE[code];
  if (entry && entry.status !== "DRAFT") return entry;

  const formula = getFormulaCountryPricing(code);
  if (!formula) return null;
  return {
    countryCode: formula.countryCode,
    currency: formula.currency,
    formatLocale: "en-US",
    status: "FORMULA",
    version: `formula-${formula.asOf}`,
    effectiveDate: formula.asOf,
    approvedBy: "owner-approved formula (2026-10-19)",
    // Buy buttons only where checkout would charge exactly the displayed amount (USD at US price).
    checkoutEnabled: formula.matchesUsCheckout,
    plans: formula.plans,
  };
}

export function formatCountryPrice(amount: number, entry: Pick<CountryPriceEntry, "currency" | "formatLocale">): string {
  return new Intl.NumberFormat(entry.formatLocale, {
    style: "currency",
    currency: entry.currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
