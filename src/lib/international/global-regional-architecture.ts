export const REGION_IDS = [
  "north-america",
  "latin-america",
  "caribbean",
  "europe",
  "africa",
  "asia",
] as const;

export type RegionId = (typeof REGION_IDS)[number];

export const REGION_STATUS = [
  "planned",
  "internal",
  "beta",
  "active",
  "suspended",
  "retired",
] as const;

export type ActivationStatus = (typeof REGION_STATUS)[number];
export type LaunchPhase = "north-america-launch" | "regional-foundation" | "regional-expansion";
export type LanguageDirection = "ltr" | "rtl";
export type TranslationCompleteness =
  | "none"
  | "partial"
  | "translated"
  | "reviewed"
  | "complete";
export type TranslationDomain =
  | "common-ui"
  | "page-copy"
  | "legal-copy"
  | "pricing-copy"
  | "payment-copy"
  | "error-messages"
  | "email-copy"
  | "course-content"
  | "book-content"
  | "metadata";
export type PaymentProviderId =
  | "square"
  | "paypal"
  | "stripe"
  | "flutterwave"
  | "paystack"
  | "mobile-money"
  | "regional-partner";
export type LegalDocumentType =
  | "terms"
  | "privacy"
  | "cookies"
  | "refunds"
  | "accessibility"
  | "recurring-payment-consent"
  | "regional-disclosures"
  | "educational-disclaimer"
  | "financial-advice-disclaimer"
  | "age-requirements"
  | "data-processing-notice";
export type LegalStatus =
  | "draft"
  | "translated"
  | "legal-review-required"
  | "approved"
  | "active"
  | "retired";

export interface LanguageConfiguration {
  code: string;
  baseLanguage: string;
  regionalVariant?: string;
  direction: LanguageDirection;
  enabled: boolean;
  public: boolean;
  fallbackChain: string[];
  translationCompleteness: Partial<Record<TranslationDomain, TranslationCompleteness>>;
  seoEligible: boolean;
}

export interface CountryConfiguration {
  isoCode: string;
  region: RegionId;
  enabled: boolean;
  supportedLanguages: string[];
  defaultLanguage: string;
  supportedCurrencies: string[];
  defaultCurrency: string;
  pricingGroup: string;
  paymentProviders: PaymentProviderId[];
  taxTreatment: string;
  legalVariant: string;
  ageRequirements?: { minimumAge: number; jurisdiction: string };
}

export interface RegionConfiguration {
  id: RegionId;
  name: string;
  enabled: boolean;
  status: ActivationStatus;
  launchPhase: LaunchPhase;
  countries: string[];
  defaultCountry: string;
  supportedLanguages: string[];
  defaultLanguage: string;
  currencies: string[];
  defaultCurrency: string;
  paymentProviders: PaymentProviderId[];
  contentCatalog: string;
  legalDocuments: LegalDocumentType[];
  pricingTable: string;
  taxBehavior: string;
  supportChannels: string[];
  emergencyDisable: boolean;
}

export interface PricingRecord {
  id: string;
  region: RegionId;
  country?: string;
  membershipTier: "starter" | "pro" | "gold";
  displayCurrency: string;
  billingCurrency: string;
  marketPrice: number;
  status: "planned" | "approved" | "active" | "retired";
  effectiveFrom: string;
  effectiveTo?: string;
  version: number;
}

export interface PaymentProviderCapability {
  id: PaymentProviderId;
  status: ActivationStatus;
  enabled: boolean;
  regions: RegionId[];
  countries: string[];
  capabilities: Array<"subscription" | "one-time" | "wallet" | "bank-transfer" | "mobile-money">;
}

export interface LegalDocumentEntry {
  id: string;
  type: LegalDocumentType;
  region: RegionId;
  country?: string;
  language: string;
  status: LegalStatus;
  version: string;
  updatedAt: string;
}

export interface RegionalContentRule {
  contentId: string;
  region: RegionId;
  countries?: string[];
  languages?: string[];
  membershipTiers?: Array<"starter" | "pro" | "gold">;
  academyLevels?: string[];
  pillars?: string[];
  legalRestriction?: string;
  launchPhase?: LaunchPhase;
  available: boolean;
}

export const LANGUAGE_CONFIG: Record<string, LanguageConfiguration> = {
  "en-US": {
    code: "en-US",
    baseLanguage: "en",
    regionalVariant: "US",
    direction: "ltr",
    enabled: true,
    public: true,
    fallbackChain: ["en-US", "en"],
    translationCompleteness: {
      "common-ui": "complete",
      "page-copy": "complete",
      "legal-copy": "complete",
      metadata: "complete",
    },
    seoEligible: true,
  },
  en: {
    code: "en",
    baseLanguage: "en",
    direction: "ltr",
    enabled: true,
    public: true,
    fallbackChain: ["en", "en-US"],
    translationCompleteness: {
      "common-ui": "complete",
      "page-copy": "complete",
      metadata: "complete",
    },
    seoEligible: true,
  },
  es: {
    code: "es",
    baseLanguage: "es",
    direction: "ltr",
    enabled: true,
    public: true,
    fallbackChain: ["es", "en-US"],
    translationCompleteness: {
      "common-ui": "reviewed",
      "page-copy": "reviewed",
      metadata: "reviewed",
    },
    seoEligible: true,
  },
  "fr-CA": {
    code: "fr-CA",
    baseLanguage: "fr",
    regionalVariant: "CA",
    direction: "ltr",
    enabled: true,
    public: true,
    fallbackChain: ["fr-CA", "en-US"],
    translationCompleteness: {
      "common-ui": "reviewed",
      "page-copy": "reviewed",
      "legal-copy": "translated",
      metadata: "reviewed",
    },
    seoEligible: true,
  },
  "fr-FR": {
    code: "fr-FR",
    baseLanguage: "fr",
    regionalVariant: "FR",
    direction: "ltr",
    enabled: true,
    public: true,
    fallbackChain: ["fr-FR", "fr-CA", "en-US"],
    translationCompleteness: {
      "common-ui": "partial",
      "page-copy": "partial",
      "legal-copy": "partial",
      metadata: "partial",
    },
    seoEligible: false,
  },
  fr: {
    code: "fr",
    baseLanguage: "fr",
    direction: "ltr",
    enabled: true,
    public: false,
    fallbackChain: ["fr", "fr-CA", "en-US"],
    translationCompleteness: {
      "common-ui": "partial",
      "page-copy": "partial",
    },
    seoEligible: false,
  },
  ar: {
    code: "ar",
    baseLanguage: "ar",
    direction: "rtl",
    enabled: true,
    public: false,
    fallbackChain: ["ar", "en"],
    translationCompleteness: {
      "common-ui": "partial",
      "page-copy": "none",
    },
    seoEligible: false,
  },
  ja: {
    code: "ja",
    baseLanguage: "ja",
    direction: "ltr",
    enabled: true,
    public: false,
    fallbackChain: ["ja", "en"],
    translationCompleteness: {
      "common-ui": "partial",
      "page-copy": "none",
    },
    seoEligible: false,
  },
  ko: {
    code: "ko",
    baseLanguage: "ko",
    direction: "ltr",
    enabled: true,
    public: false,
    fallbackChain: ["ko", "en"],
    translationCompleteness: {
      "common-ui": "partial",
      "page-copy": "none",
    },
    seoEligible: false,
  },
  "zh-Hans": {
    code: "zh-Hans",
    baseLanguage: "zh",
    regionalVariant: "Hans",
    direction: "ltr",
    enabled: true,
    public: false,
    fallbackChain: ["zh-Hans", "en"],
    translationCompleteness: {
      "common-ui": "partial",
      "page-copy": "none",
    },
    seoEligible: false,
  },
  "zh-Hant": {
    code: "zh-Hant",
    baseLanguage: "zh",
    regionalVariant: "Hant",
    direction: "ltr",
    enabled: true,
    public: false,
    fallbackChain: ["zh-Hant", "zh-Hans", "en"],
    translationCompleteness: {
      "common-ui": "partial",
      "page-copy": "none",
    },
    seoEligible: false,
  },
  hi: {
    code: "hi",
    baseLanguage: "hi",
    direction: "ltr",
    enabled: true,
    public: false,
    fallbackChain: ["hi", "en"],
    translationCompleteness: {
      "common-ui": "partial",
      "page-copy": "none",
    },
    seoEligible: false,
  },
  ht: {
    code: "ht",
    baseLanguage: "ht",
    direction: "ltr",
    enabled: false,
    public: false,
    fallbackChain: ["ht", "fr", "en-US"],
    translationCompleteness: {
      "common-ui": "none",
      "page-copy": "none",
    },
    seoEligible: false,
  },
};

export const COUNTRY_CONFIG: Record<string, CountryConfiguration> = {
  US: {
    isoCode: "US",
    region: "north-america",
    enabled: true,
    supportedLanguages: ["en-US", "es"],
    defaultLanguage: "en-US",
    supportedCurrencies: ["USD"],
    defaultCurrency: "USD",
    pricingGroup: "na-us",
    paymentProviders: ["square", "paypal"],
    taxTreatment: "sales-tax",
    legalVariant: "us",
    ageRequirements: { minimumAge: 13, jurisdiction: "COPPA baseline" },
  },
  CA: {
    isoCode: "CA",
    region: "north-america",
    enabled: true,
    supportedLanguages: ["en-US", "fr-CA"],
    defaultLanguage: "en-US",
    supportedCurrencies: ["CAD", "USD"],
    defaultCurrency: "CAD",
    pricingGroup: "na-ca",
    paymentProviders: ["square", "paypal"],
    taxTreatment: "gst-hst-pst",
    legalVariant: "ca",
  },
  MX: {
    isoCode: "MX",
    region: "latin-america",
    enabled: false,
    supportedLanguages: ["es", "en"],
    defaultLanguage: "es",
    supportedCurrencies: ["MXN", "USD"],
    defaultCurrency: "MXN",
    pricingGroup: "latam-mx",
    paymentProviders: ["paypal", "stripe"],
    taxTreatment: "vat",
    legalVariant: "mx",
  },
  DO: {
    isoCode: "DO",
    region: "caribbean",
    enabled: false,
    supportedLanguages: ["es", "en", "fr"],
    defaultLanguage: "es",
    supportedCurrencies: ["DOP", "USD"],
    defaultCurrency: "DOP",
    pricingGroup: "caribbean-do",
    paymentProviders: ["paypal", "stripe"],
    taxTreatment: "mixed",
    legalVariant: "do",
  },
  FR: {
    isoCode: "FR",
    region: "europe",
    enabled: false,
    supportedLanguages: ["fr-FR", "en"],
    defaultLanguage: "fr-FR",
    supportedCurrencies: ["EUR"],
    defaultCurrency: "EUR",
    pricingGroup: "eu-fr",
    paymentProviders: ["stripe"],
    taxTreatment: "vat",
    legalVariant: "fr",
  },
  UG: {
    isoCode: "UG",
    region: "africa",
    enabled: false,
    supportedLanguages: ["en", "fr"],
    defaultLanguage: "en",
    supportedCurrencies: ["UGX", "USD"],
    defaultCurrency: "UGX",
    pricingGroup: "africa-east",
    paymentProviders: ["flutterwave", "mobile-money"],
    taxTreatment: "vat",
    legalVariant: "ug",
  },
  JP: {
    isoCode: "JP",
    region: "asia",
    enabled: false,
    supportedLanguages: ["ja", "en"],
    defaultLanguage: "ja",
    supportedCurrencies: ["JPY", "USD"],
    defaultCurrency: "JPY",
    pricingGroup: "asia-jp",
    paymentProviders: ["stripe", "regional-partner"],
    taxTreatment: "consumption-tax",
    legalVariant: "jp",
  },
};

export const REGION_CONFIG: Record<RegionId, RegionConfiguration> = {
  "north-america": {
    id: "north-america",
    name: "North America",
    enabled: true,
    status: "active",
    launchPhase: "north-america-launch",
    countries: ["US", "CA"],
    defaultCountry: "US",
    supportedLanguages: ["en-US", "es", "fr-CA", "fr-FR"],
    defaultLanguage: "en-US",
    currencies: ["USD", "CAD"],
    defaultCurrency: "USD",
    paymentProviders: ["square", "paypal"],
    contentCatalog: "na-core",
    legalDocuments: [
      "terms",
      "privacy",
      "cookies",
      "refunds",
      "accessibility",
      "financial-advice-disclaimer",
      "educational-disclaimer",
      "recurring-payment-consent",
      "age-requirements",
    ],
    pricingTable: "na-membership-v1",
    taxBehavior: "sales-tax-by-jurisdiction",
    supportChannels: ["email", "chat"],
    emergencyDisable: false,
  },
  "latin-america": {
    id: "latin-america",
    name: "Latin America",
    enabled: false,
    status: "internal",
    launchPhase: "regional-foundation",
    countries: ["MX"],
    defaultCountry: "MX",
    supportedLanguages: ["es", "en"],
    defaultLanguage: "es",
    currencies: ["MXN", "USD"],
    defaultCurrency: "USD",
    paymentProviders: ["paypal", "stripe"],
    contentCatalog: "latam-core",
    legalDocuments: [
      "terms",
      "privacy",
      "cookies",
      "refunds",
      "regional-disclosures",
      "financial-advice-disclaimer",
      "data-processing-notice",
    ],
    pricingTable: "latam-membership-v1",
    taxBehavior: "vat-by-country",
    supportChannels: ["email"],
    emergencyDisable: false,
  },
  caribbean: {
    id: "caribbean",
    name: "Caribbean",
    enabled: false,
    status: "planned",
    launchPhase: "regional-foundation",
    countries: ["DO"],
    defaultCountry: "DO",
    supportedLanguages: ["en", "es", "fr", "ht"],
    defaultLanguage: "en",
    currencies: ["DOP", "USD"],
    defaultCurrency: "USD",
    paymentProviders: ["paypal", "stripe"],
    contentCatalog: "caribbean-core",
    legalDocuments: [
      "terms",
      "privacy",
      "cookies",
      "refunds",
      "regional-disclosures",
      "educational-disclaimer",
      "financial-advice-disclaimer",
    ],
    pricingTable: "caribbean-membership-v1",
    taxBehavior: "mixed",
    supportChannels: ["email"],
    emergencyDisable: false,
  },
  europe: {
    id: "europe",
    name: "Europe",
    enabled: false,
    status: "planned",
    launchPhase: "regional-foundation",
    countries: ["FR"],
    defaultCountry: "FR",
    supportedLanguages: ["en", "es", "fr-FR"],
    defaultLanguage: "en",
    currencies: ["EUR"],
    defaultCurrency: "EUR",
    paymentProviders: ["stripe"],
    contentCatalog: "europe-core",
    legalDocuments: [
      "terms",
      "privacy",
      "cookies",
      "refunds",
      "data-processing-notice",
      "accessibility",
      "regional-disclosures",
      "recurring-payment-consent",
    ],
    pricingTable: "europe-membership-v1",
    taxBehavior: "vat",
    supportChannels: ["email"],
    emergencyDisable: false,
  },
  africa: {
    id: "africa",
    name: "Africa",
    enabled: false,
    status: "planned",
    launchPhase: "regional-expansion",
    countries: ["UG"],
    defaultCountry: "UG",
    supportedLanguages: ["en", "fr", "ar"],
    defaultLanguage: "en",
    currencies: ["UGX", "USD"],
    defaultCurrency: "USD",
    paymentProviders: ["flutterwave", "paystack", "mobile-money", "stripe"],
    contentCatalog: "africa-core",
    legalDocuments: [
      "terms",
      "privacy",
      "cookies",
      "refunds",
      "regional-disclosures",
      "age-requirements",
      "educational-disclaimer",
      "financial-advice-disclaimer",
    ],
    pricingTable: "africa-membership-v1",
    taxBehavior: "vat-country-driven",
    supportChannels: ["email"],
    emergencyDisable: false,
  },
  asia: {
    id: "asia",
    name: "Asia",
    enabled: false,
    status: "planned",
    launchPhase: "regional-expansion",
    countries: ["JP"],
    defaultCountry: "JP",
    supportedLanguages: ["en", "ja", "ko", "zh-Hans", "zh-Hant", "hi"],
    defaultLanguage: "en",
    currencies: ["JPY", "USD"],
    defaultCurrency: "USD",
    paymentProviders: ["stripe", "regional-partner"],
    contentCatalog: "asia-core",
    legalDocuments: [
      "terms",
      "privacy",
      "cookies",
      "refunds",
      "regional-disclosures",
      "recurring-payment-consent",
      "educational-disclaimer",
      "financial-advice-disclaimer",
    ],
    pricingTable: "asia-membership-v1",
    taxBehavior: "country-tax-engine",
    supportChannels: ["email"],
    emergencyDisable: false,
  },
};

export const PRICING_TABLE: PricingRecord[] = [
  {
    id: "na-starter-v1",
    region: "north-america",
    membershipTier: "starter",
    displayCurrency: "USD",
    billingCurrency: "USD",
    marketPrice: 49,
    status: "active",
    effectiveFrom: "2026-01-01",
    version: 1,
  },
  {
    id: "latam-starter-v1",
    region: "latin-america",
    membershipTier: "starter",
    displayCurrency: "USD",
    billingCurrency: "USD",
    marketPrice: 39,
    status: "planned",
    effectiveFrom: "2026-10-01",
    version: 1,
  },
  {
    id: "asia-starter-v1",
    region: "asia",
    membershipTier: "starter",
    displayCurrency: "USD",
    billingCurrency: "USD",
    marketPrice: 39,
    status: "planned",
    effectiveFrom: "2026-12-01",
    version: 1,
  },
];

export const PAYMENT_PROVIDER_CAPABILITIES: PaymentProviderCapability[] = [
  {
    id: "square",
    status: "active",
    enabled: true,
    regions: ["north-america"],
    countries: ["US", "CA"],
    capabilities: ["subscription", "one-time", "wallet"],
  },
  {
    id: "paypal",
    status: "internal",
    enabled: true,
    regions: ["north-america", "latin-america", "caribbean"],
    countries: ["US", "CA", "MX", "DO"],
    capabilities: ["subscription", "one-time", "wallet"],
  },
  {
    id: "stripe",
    status: "planned",
    enabled: false,
    regions: ["latin-america", "caribbean", "europe", "africa", "asia"],
    countries: ["MX", "DO", "FR", "UG", "JP"],
    capabilities: ["subscription", "one-time"],
  },
  {
    id: "flutterwave",
    status: "planned",
    enabled: false,
    regions: ["africa"],
    countries: ["UG"],
    capabilities: ["subscription", "one-time", "mobile-money"],
  },
  {
    id: "paystack",
    status: "planned",
    enabled: false,
    regions: ["africa"],
    countries: ["UG"],
    capabilities: ["subscription", "one-time"],
  },
  {
    id: "mobile-money",
    status: "planned",
    enabled: false,
    regions: ["africa"],
    countries: ["UG"],
    capabilities: ["mobile-money", "one-time"],
  },
  {
    id: "regional-partner",
    status: "planned",
    enabled: false,
    regions: ["asia"],
    countries: ["JP"],
    capabilities: ["one-time", "wallet", "bank-transfer"],
  },
];

export const LEGAL_REGISTRY: LegalDocumentEntry[] = [
  {
    id: "na-terms-en-us-v1",
    type: "terms",
    region: "north-america",
    country: "US",
    language: "en-US",
    status: "active",
    version: "1.0.0",
    updatedAt: "2026-01-01",
  },
  {
    id: "na-privacy-fr-ca-v1",
    type: "privacy",
    region: "north-america",
    country: "CA",
    language: "fr-CA",
    status: "approved",
    version: "1.0.0",
    updatedAt: "2026-01-01",
  },
  {
    id: "eu-privacy-fr-fr-v1",
    type: "privacy",
    region: "europe",
    country: "FR",
    language: "fr-FR",
    status: "legal-review-required",
    version: "0.9.0",
    updatedAt: "2026-06-01",
  },
];

export const CONTENT_CATALOG_RULES: RegionalContentRule[] = [
  {
    contentId: "membership-core",
    region: "north-america",
    available: true,
    launchPhase: "north-america-launch",
  },
  {
    contentId: "academy-level-2",
    region: "north-america",
    membershipTiers: ["pro", "gold"],
    academyLevels: ["L2", "L3"],
    available: true,
  },
  {
    contentId: "latam-preview",
    region: "latin-america",
    launchPhase: "regional-foundation",
    languages: ["es"],
    available: false,
  },
];

export const GLOBAL_FALLBACK = {
  region: "north-america" as RegionId,
  country: "US",
  language: "en-US",
  currency: "USD",
};

export function getRegionConfig(regionId?: string): RegionConfiguration {
  return REGION_CONFIG[(regionId as RegionId) || GLOBAL_FALLBACK.region] ?? REGION_CONFIG[GLOBAL_FALLBACK.region];
}

export function getCountryConfig(countryCode?: string): CountryConfiguration | null {
  if (!countryCode) {
    return null;
  }

  return COUNTRY_CONFIG[countryCode.toUpperCase()] ?? null;
}

export function getLanguageConfig(languageCode?: string): LanguageConfiguration {
  if (!languageCode) {
    return LANGUAGE_CONFIG[GLOBAL_FALLBACK.language];
  }

  if (LANGUAGE_CONFIG[languageCode]) {
    return LANGUAGE_CONFIG[languageCode];
  }

  const normalized = languageCode.toLowerCase();
  const direct = Object.values(LANGUAGE_CONFIG).find(
    (language) => language.code.toLowerCase() === normalized
  );
  if (direct) {
    return direct;
  }

  const base = normalized.split("-")[0];
  const fromBase = Object.values(LANGUAGE_CONFIG).find(
    (language) => language.baseLanguage === base
  );
  return fromBase ?? LANGUAGE_CONFIG[GLOBAL_FALLBACK.language];
}

export function getRegionForCountry(countryCode?: string): RegionId {
  return getCountryConfig(countryCode)?.region ?? GLOBAL_FALLBACK.region;
}

export function getPublicLanguageCodes(regionId?: string): string[] {
  const region = getRegionConfig(regionId);

  return region.supportedLanguages.filter((languageCode) => {
    const language = getLanguageConfig(languageCode);
    return language.enabled && language.public;
  });
}

export function resolveLanguageForRegion(
  requestedLanguage: string | undefined,
  regionId: RegionId,
  includePrivate = false
): string {
  const requested = requestedLanguage ? getLanguageConfig(requestedLanguage) : null;
  const available = getRegionConfig(regionId).supportedLanguages;

  if (
    requested &&
    requested.enabled &&
    available.includes(requested.code) &&
    (includePrivate || requested.public)
  ) {
    return requested.code;
  }

  if (requested) {
    for (const fallback of requested.fallbackChain) {
      const fallbackLanguage = getLanguageConfig(fallback);
      if (
        fallbackLanguage.enabled &&
        available.includes(fallbackLanguage.code) &&
        (includePrivate || fallbackLanguage.public)
      ) {
        return fallbackLanguage.code;
      }
    }
  }

  const defaultLanguage = getLanguageConfig(getRegionConfig(regionId).defaultLanguage);
  if (defaultLanguage.enabled && (includePrivate || defaultLanguage.public)) {
    return defaultLanguage.code;
  }

  return GLOBAL_FALLBACK.language;
}

export function resolveCurrencyForCountry(countryCode?: string): string {
  const country = getCountryConfig(countryCode);
  if (country?.enabled) {
    return country.defaultCurrency;
  }

  const region = getRegionConfig(country?.region);
  return region.defaultCurrency;
}

export function selectPricingRecord(input: {
  region: RegionId;
  membershipTier: "starter" | "pro" | "gold";
  country?: string;
  asOf?: string;
}): PricingRecord | null {
  const asOf = input.asOf ?? new Date().toISOString().slice(0, 10);

  const candidates = PRICING_TABLE.filter((record) => {
    const countryMatches = !record.country || record.country === input.country;
    const dateValid = record.effectiveFrom <= asOf && (!record.effectiveTo || asOf <= record.effectiveTo);

    return (
      record.region === input.region &&
      record.membershipTier === input.membershipTier &&
      countryMatches &&
      dateValid &&
      record.status === "active"
    );
  });

  if (candidates.length === 0) {
    return null;
  }

  return candidates.sort((a, b) => b.version - a.version)[0];
}

export function selectPaymentProviderServerSide(input: {
  region: RegionId;
  country?: string;
  preferredProvider?: PaymentProviderId;
}): { provider: PaymentProviderId | null; reason: string } {
  const region = getRegionConfig(input.region);

  if (!region.enabled || region.status === "planned" || region.status === "internal" || region.emergencyDisable) {
    return { provider: null, reason: "Region is not publicly active" };
  }

  const country = getCountryConfig(input.country);
  const allowedProviders = country?.paymentProviders ?? region.paymentProviders;
  const serverEnabledProviders = PAYMENT_PROVIDER_CAPABILITIES.filter(
    (provider) =>
      provider.enabled &&
      provider.regions.includes(region.id) &&
      (!input.country || provider.countries.includes(input.country.toUpperCase()))
  ).map((provider) => provider.id);

  const supportedProviders = allowedProviders.filter((provider) => serverEnabledProviders.includes(provider));

  if (input.preferredProvider && supportedProviders.includes(input.preferredProvider)) {
    return { provider: input.preferredProvider, reason: "Preferred provider accepted" };
  }

  return {
    provider: supportedProviders[0] ?? null,
    reason: supportedProviders[0] ? "Resolved from region/country capability" : "No active provider configured",
  };
}

export function resolveLegalDocument(input: {
  region: RegionId;
  type: LegalDocumentType;
  language: string;
  country?: string;
}): LegalDocumentEntry | null {
  const exact = LEGAL_REGISTRY.find(
    (entry) =>
      entry.region === input.region &&
      entry.type === input.type &&
      entry.language === input.language &&
      entry.country === input.country &&
      (entry.status === "approved" || entry.status === "active")
  );

  if (exact) {
    return exact;
  }

  const languageFallback = resolveLanguageForRegion(input.language, input.region, true);
  return (
    LEGAL_REGISTRY.find(
      (entry) =>
        entry.region === input.region &&
        entry.type === input.type &&
        entry.language === languageFallback &&
        (entry.status === "approved" || entry.status === "active")
    ) ?? null
  );
}

export function isContentAvailable(input: {
  contentId: string;
  region: RegionId;
  country?: string;
  language?: string;
  membershipTier?: "starter" | "pro" | "gold";
  academyLevel?: string;
  pillar?: string;
  launchPhase?: LaunchPhase;
}): boolean {
  const rule = CONTENT_CATALOG_RULES.find(
    (entry) => entry.contentId === input.contentId && entry.region === input.region
  );

  if (!rule) {
    return false;
  }

  if (rule.launchPhase && input.launchPhase && rule.launchPhase !== input.launchPhase) {
    return false;
  }

  if (rule.countries && (!input.country || !rule.countries.includes(input.country.toUpperCase()))) {
    return false;
  }

  if (rule.languages && (!input.language || !rule.languages.includes(input.language))) {
    return false;
  }

  if (
    rule.membershipTiers &&
    (!input.membershipTier || !rule.membershipTiers.includes(input.membershipTier))
  ) {
    return false;
  }

  if (rule.academyLevels && (!input.academyLevel || !rule.academyLevels.includes(input.academyLevel))) {
    return false;
  }

  if (rule.pillars && (!input.pillar || !rule.pillars.includes(input.pillar))) {
    return false;
  }

  return rule.available;
}

export function resolveSeoAlternates(input: {
  canonicalPath: string;
  region?: RegionId;
}): Record<string, string> {
  const region = input.region ?? GLOBAL_FALLBACK.region;
  const publicLanguages = getPublicLanguageCodes(region);

  const alternates = Object.fromEntries(
    publicLanguages.map((language) => [language, `https://www.edunancial.com/${language}${input.canonicalPath}`])
  );

  alternates["x-default"] = `https://www.edunancial.com${input.canonicalPath}`;
  return alternates;
}

export function reportMissingTranslation(input: {
  language: string;
  key: string;
  namespace: TranslationDomain;
}): { isMissing: boolean; fallbackChain: string[] } {
  const language = getLanguageConfig(input.language);
  const completeness = language.translationCompleteness[input.namespace] ?? "none";

  return {
    isMissing: completeness === "none" || completeness === "partial",
    fallbackChain: language.fallbackChain,
  };
}
