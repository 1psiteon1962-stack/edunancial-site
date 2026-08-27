import { resolveCatalogItem } from "@/lib/payments/catalog";

export interface CountryPricingPolicy {
  countryCode: string;
  currency: string;
  usdExchangeRate: number;
  rateVersion: string;
  effectiveFrom: string;
  rounding: "base" | "retail-99";
}

export interface LocalizedPrice {
  countryCode: string;
  currency: string;
  amount: number;
  baseUsdAmount: number;
  exchangeRate: number;
  rateVersion: string;
}

/**
 * Commercial pricing policy. USD remains the master price. Country prices are
 * derived from that master price using a controlled planning rate rather than
 * a live FX quote on every page view. Add countries here only after pricing is
 * approved; payment settlement remains independently gated by country controls.
 */
export const COUNTRY_PRICING_POLICIES: Record<string, CountryPricingPolicy> = {
  US: {
    countryCode: "US",
    currency: "USD",
    usdExchangeRate: 1,
    rateVersion: "us-base-2026-q3",
    effectiveFrom: "2026-08-26",
    rounding: "base",
  },
  CA: {
    countryCode: "CA",
    currency: "CAD",
    usdExchangeRate: 1.39,
    rateVersion: "ca-2026-q3-1.39",
    effectiveFrom: "2026-08-26",
    rounding: "retail-99",
  },
};

function normalizeCountryCode(countryCode: string) {
  return countryCode.trim().toUpperCase();
}

function retail99(value: number) {
  if (value <= 0) return 0;
  return Number((Math.floor(value) + 0.99).toFixed(2));
}

export function getCountryPricingPolicy(countryCode: string) {
  return COUNTRY_PRICING_POLICIES[normalizeCountryCode(countryCode)];
}

export function localizeUsdPrice(baseUsdAmount: number, countryCode: string): LocalizedPrice | null {
  const policy = getCountryPricingPolicy(countryCode);
  if (!policy) return null;

  const raw = baseUsdAmount * policy.usdExchangeRate;
  const amount = policy.rounding === "retail-99" ? retail99(raw) : Number(raw.toFixed(2));

  return {
    countryCode: policy.countryCode,
    currency: policy.currency,
    amount,
    baseUsdAmount: Number(baseUsdAmount.toFixed(2)),
    exchangeRate: policy.usdExchangeRate,
    rateVersion: policy.rateVersion,
  };
}

export function getLocalizedCatalogPrice(itemId: string, countryCode: string): LocalizedPrice | null {
  const item = resolveCatalogItem(itemId);
  if (!item || !item.active || item.currency.toUpperCase() !== "USD") return null;
  return localizeUsdPrice(item.price, countryCode);
}

export function formatLocalizedPrice(price: LocalizedPrice, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: price.currency,
  }).format(price.amount);
}
