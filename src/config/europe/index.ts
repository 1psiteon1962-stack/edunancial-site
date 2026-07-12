// src/config/europe/index.ts
// Central Europe regional configuration — re-exports countries, VAT, deployment, and
// assembles the full Europe regional profile consumed by pricing, routing,
// and localization layers.

export * from "./countries";
export * from "./vat";
export * from "./deployment";

import { EUROPEAN_COUNTRIES, getEuropeanCountriesByRegion } from "./countries";

export const EUROPE_REGION_METADATA = {
  id: "europe",
  slugs: ["europe-2a", "europe-2b"] as const,
  supportedLanguages: ["en", "fr", "de", "es", "it", "pt"] as const,
  defaultLanguage: "en",
  supportedCurrencies: ["EUR", "GBP", "CHF", "PLN", "CZK", "HUF", "RON", "BGN"] as const,
  defaultCurrency: "EUR",
  gdprApplicable: true,
  psd2Applicable: true,
  vatModel: "inclusive" as const,
  complianceFrameworks: ["gdpr", "psd2", "ePrivacy", "oss"] as const,
  paymentProviders: ["stripe", "paypal"] as const,
  legalDocumentPaths: {
    gdpr: "/legal/gdpr",
    privacy: "/legal/privacy",
    cookies: "/legal/cookies",
    terms: "/legal/terms",
    dataProcessingAgreement: "/legal/dpa",
    refunds: "/legal/refunds",
  },
  featureFlags: {
    gdprConsentBanner: true,
    cookiePreferenceCenter: true,
    dataPortabilityRequest: true,
    rightToErasureRequest: true,
    vatDisplay: true,
    multiCurrencyCheckout: true,
    psd2StrongAuthentication: true,
    hreflangAlternates: true,
  },
  deploymentConfig: {
    cdnRegion: "eu-west",
    dataResidency: "EU",
    backupRegion: "eu-central",
    preferredEdgeLocations: ["Frankfurt", "Paris", "London", "Amsterdam"],
  },
} as const;

export const EUROPE_2A_COUNTRIES = getEuropeanCountriesByRegion("europe-2a");
export const EUROPE_2B_COUNTRIES = getEuropeanCountriesByRegion("europe-2b");

export const EUROPE_COUNTRY_CODES = EUROPEAN_COUNTRIES.map((c) => c.code);

export function isEuropeanCountry(countryCode: string): boolean {
  return EUROPE_COUNTRY_CODES.includes(countryCode.toUpperCase());
}

export function getEuropeSubRegion(
  countryCode: string
): "europe-2a" | "europe-2b" | null {
  const country = EUROPEAN_COUNTRIES.find(
    (c) => c.code === countryCode.toUpperCase()
  );
  return country?.region ?? null;
}
