export type RegionSlug =
  | "north-america"
  | "latin-america-2a"
  | "latin-america-2b"
  | "caribbean"
  | "europe-2a"
  | "europe-2b"
  | "africa"
  | "middle-east"
  | "asia"
  | "oceania";

export type LegalNoticeType =
  | "privacy"
  | "cookies"
  | "terms"
  | "refunds"
  | "consumerRights"
  | "educationalDisclaimer"
  | "taxDisclaimer"
  | "investmentDisclaimer";

export type ContentStatusDimension =
  | "Global Complete"
  | "Localization Needed"
  | "Legal Review Needed"
  | "Translation Needed"
  | "Ready for Publication";

export type PaymentProvider =
  | "square"
  | "stripe"
  | "flutterwave"
  | "paystack"
  | "mobile-money"
  | "regional-gateway";

export interface LocalizationAssets {
  dateFormat: string;
  numberFormat: string;
  addressFormat: string;
  phoneFormat: string;
  measurementUnits: "imperial" | "metric";
  timezone: string;
}

export interface RegionalContent {
  currency: string;
  legalNotices: Record<LegalNoticeType, string>;
  taxDisclaimers: string[];
  consumerDisclosures: string[];
  paymentProviders: PaymentProvider[];
  localizationAssets: LocalizationAssets;
  educationalExamples: Record<string, string>;
}

interface ContentLayers {
  globalCore: RegionalContent;
  regionalOverrides: Record<RegionSlug, Partial<RegionalContent>>;
  countryOverrides: Record<string, Partial<RegionalContent>>;
}

interface RegionConfiguration {
  slug: RegionSlug;
  name: string;
  enabled: boolean;
  supportedLanguages: string[];
  supportedCurrencies: string[];
  status: ContentStatusDimension;
  translationCompletion: number;
  localizationCompletion: number;
}

interface CountryConfiguration {
  countryCode: string;
  country: string;
  region: RegionSlug;
}

export interface RegionalizationAiHooks {
  regionalExampleRecommendation: string | null;
  regionalLegalReviewFlag: string | null;
  translationSuggestion: string | null;
  currencyConversionHint: string | null;
}

export interface RegionalizationResolution {
  region: RegionSlug;
  countryCode?: string;
  interfaceLanguage: string;
  currency: string;
  legalNotices: Record<LegalNoticeType, string>;
  taxDisclaimers: string[];
  consumerDisclosures: string[];
  paymentProviders: PaymentProvider[];
  localizationAssets: LocalizationAssets;
  educationalExamples: Record<string, string>;
  status: ContentStatusDimension;
  translationCompletion: number;
  localizationCompletion: number;
  ai: RegionalizationAiHooks;
}

const GLOBAL_LEGAL_NOTICES: Record<LegalNoticeType, string> = {
  privacy: "Global privacy notice baseline.",
  cookies: "Global cookies notice baseline.",
  terms: "Global terms baseline.",
  refunds: "Global refund baseline.",
  consumerRights: "Global consumer rights baseline.",
  educationalDisclaimer: "Global educational disclaimer baseline.",
  taxDisclaimer: "Global tax disclaimer baseline.",
  investmentDisclaimer: "Global investment disclaimer baseline.",
};

const CONTENT_LAYERS: ContentLayers = {
  globalCore: {
    currency: "USD",
    legalNotices: GLOBAL_LEGAL_NOTICES,
    taxDisclaimers: ["Global tax disclaimer."],
    consumerDisclosures: ["Global consumer disclosure."],
    paymentProviders: ["stripe"],
    localizationAssets: {
      dateFormat: "YYYY-MM-DD",
      numberFormat: "1,234.56",
      addressFormat: "street-city-region-postal-country",
      phoneFormat: "+[country]-[number]",
      measurementUnits: "metric",
      timezone: "UTC",
    },
    educationalExamples: {
      mortgage:
        "Use the same mortgage concept with region-aware currency and legal references.",
    },
  },
  regionalOverrides: {
    "north-america": {
      currency: "USD",
      paymentProviders: ["square", "stripe"],
      legalNotices: {
        ...GLOBAL_LEGAL_NOTICES,
        privacy: "North America privacy notice.",
        terms: "North America terms and conditions.",
      },
      localizationAssets: {
        dateFormat: "MM/DD/YYYY",
        numberFormat: "1,234.56",
        addressFormat: "street-city-state-zip-country",
        phoneFormat: "+1 (###) ###-####",
        measurementUnits: "imperial",
        timezone: "America/New_York",
      },
    },
    "latin-america-2a": {
      localizationAssets: {
        dateFormat: "DD/MM/YYYY",
        numberFormat: "1.234,56",
        addressFormat: "street-city-state-postal-country",
        phoneFormat: "+[country] [number]",
        measurementUnits: "metric",
        timezone: "America/Mexico_City",
      },
    },
    "latin-america-2b": {
      localizationAssets: {
        dateFormat: "DD/MM/YYYY",
        numberFormat: "1.234,56",
        addressFormat: "street-city-state-postal-country",
        phoneFormat: "+[country] [number]",
        measurementUnits: "metric",
        timezone: "America/Sao_Paulo",
      },
    },
    caribbean: {
      currency: "USD",
      legalNotices: {
        ...GLOBAL_LEGAL_NOTICES,
        privacy: "Caribbean privacy notice.",
        terms: "Caribbean terms and disclosures.",
      },
      localizationAssets: {
        dateFormat: "DD/MM/YYYY",
        numberFormat: "1,234.56",
        addressFormat: "street-city-parish-postal-country",
        phoneFormat: "+1 ###-###-####",
        measurementUnits: "metric",
        timezone: "America/Santo_Domingo",
      },
    },
    "europe-2a": {
      currency: "EUR",
      paymentProviders: ["stripe"],
      legalNotices: {
        ...GLOBAL_LEGAL_NOTICES,
        privacy: "European (2A) GDPR privacy notice.",
      },
      localizationAssets: {
        dateFormat: "DD/MM/YYYY",
        numberFormat: "1.234,56",
        addressFormat: "street-postal-city-country",
        phoneFormat: "+[country] [number]",
        measurementUnits: "metric",
        timezone: "Europe/Paris",
      },
    },
    "europe-2b": {
      currency: "EUR",
      paymentProviders: ["stripe"],
    },
    africa: {
      currency: "USD",
      paymentProviders: ["flutterwave", "paystack", "mobile-money"],
      legalNotices: {
        ...GLOBAL_LEGAL_NOTICES,
        taxDisclaimer: "Africa tax disclaimer by country.",
      },
      localizationAssets: {
        dateFormat: "DD/MM/YYYY",
        numberFormat: "1,234.56",
        addressFormat: "street-city-state-postal-country",
        phoneFormat: "+[country] [number]",
        measurementUnits: "metric",
        timezone: "Africa/Lagos",
      },
    },
    "middle-east": {
      paymentProviders: ["regional-gateway", "stripe"],
    },
    asia: {
      paymentProviders: ["regional-gateway", "stripe"],
    },
    oceania: {
      currency: "AUD",
      paymentProviders: ["stripe"],
    },
  },
  countryOverrides: {
    US: {
      currency: "USD",
      legalNotices: {
        ...GLOBAL_LEGAL_NOTICES,
        privacy: "United States privacy notice.",
        terms: "United States terms and conditions.",
      },
      paymentProviders: ["square"],
      educationalExamples: {
        mortgage: "Mortgage example: $250,000 principal in USD.",
      },
    },
    CA: {
      currency: "CAD",
      paymentProviders: ["square", "stripe"],
    },
    NG: {
      currency: "NGN",
      legalNotices: {
        ...GLOBAL_LEGAL_NOTICES,
        taxDisclaimer: "Nigeria-specific tax disclaimer.",
      },
      paymentProviders: ["flutterwave", "paystack", "mobile-money"],
      educationalExamples: {
        mortgage: "Mortgage example: ₦120,000,000 principal in NGN.",
      },
      localizationAssets: {
        dateFormat: "DD/MM/YYYY",
        numberFormat: "1,234.56",
        addressFormat: "street-city-state-postal-country",
        phoneFormat: "+234 ### ### ####",
        measurementUnits: "metric",
        timezone: "Africa/Lagos",
      },
    },
    ES: {
      currency: "EUR",
      legalNotices: {
        ...GLOBAL_LEGAL_NOTICES,
        privacy: "Spain and EU privacy notice.",
      },
      paymentProviders: ["stripe"],
    },
    DO: {
      currency: "DOP",
      legalNotices: {
        ...GLOBAL_LEGAL_NOTICES,
        privacy: "Dominican Republic privacy notice.",
      },
      educationalExamples: {
        mortgage: "Mortgage example: RD$14,500,000 principal in DOP.",
      },
      paymentProviders: ["stripe"],
      localizationAssets: {
        dateFormat: "DD/MM/YYYY",
        numberFormat: "1,234.56",
        addressFormat: "street-sector-city-country",
        phoneFormat: "+1 809 ### ####",
        measurementUnits: "metric",
        timezone: "America/Santo_Domingo",
      },
    },
    JP: {
      currency: "JPY",
      educationalExamples: {
        mortgage: "Mortgage example: ¥35,000,000 principal in JPY.",
      },
      paymentProviders: ["regional-gateway", "stripe"],
      localizationAssets: {
        dateFormat: "YYYY/MM/DD",
        numberFormat: "1,234",
        addressFormat: "postal-prefecture-city-street",
        phoneFormat: "+81 ## #### ####",
        measurementUnits: "metric",
        timezone: "Asia/Tokyo",
      },
    },
  },
};

const REGION_CONFIGS: RegionConfiguration[] = [
  {
    slug: "north-america",
    name: "North America",
    enabled: true,
    supportedLanguages: ["en", "es", "fr"],
    supportedCurrencies: ["USD", "CAD"],
    status: "Ready for Publication",
    translationCompletion: 100,
    localizationCompletion: 100,
  },
  {
    slug: "latin-america-2a",
    name: "Latin America 2A",
    enabled: true,
    supportedLanguages: ["es", "pt", "en"],
    supportedCurrencies: ["USD", "MXN", "COP", "PEN"],
    status: "Translation Needed",
    translationCompletion: 72,
    localizationCompletion: 83,
  },
  {
    slug: "latin-america-2b",
    name: "Latin America 2B",
    enabled: true,
    supportedLanguages: ["pt", "es", "en"],
    supportedCurrencies: ["USD", "BRL", "ARS", "CLP"],
    status: "Localization Needed",
    translationCompletion: 78,
    localizationCompletion: 70,
  },
  {
    slug: "caribbean",
    name: "Caribbean",
    enabled: true,
    supportedLanguages: ["es", "en", "fr", "nl", "ht", "pap"],
    supportedCurrencies: ["USD", "DOP", "JMD"],
    status: "Ready for Publication",
    translationCompletion: 96,
    localizationCompletion: 95,
  },
  {
    slug: "europe-2a",
    name: "Europe 2A",
    enabled: true,
    supportedLanguages: ["en", "fr", "de", "es", "pt", "it", "nl"],
    supportedCurrencies: ["EUR", "GBP", "CHF"],
    status: "Legal Review Needed",
    translationCompletion: 87,
    localizationCompletion: 90,
  },
  {
    slug: "europe-2b",
    name: "Europe 2B",
    enabled: true,
    supportedLanguages: ["en", "fr", "de", "es", "pt", "it", "nl"],
    supportedCurrencies: ["EUR", "PLN", "CZK", "HUF"],
    status: "Localization Needed",
    translationCompletion: 82,
    localizationCompletion: 76,
  },
  {
    slug: "africa",
    name: "Africa",
    enabled: true,
    supportedLanguages: ["en", "fr", "ar", "pt", "sw", "yo", "zu", "am"],
    supportedCurrencies: ["USD", "NGN", "KES", "ZAR", "EGP"],
    status: "Translation Needed",
    translationCompletion: 68,
    localizationCompletion: 74,
  },
  {
    slug: "middle-east",
    name: "Middle East",
    enabled: true,
    supportedLanguages: ["ar", "en", "fr"],
    supportedCurrencies: ["USD", "AED", "SAR", "QAR"],
    status: "Global Complete",
    translationCompletion: 64,
    localizationCompletion: 69,
  },
  {
    slug: "asia",
    name: "Asia",
    enabled: true,
    supportedLanguages: [
      "en",
      "ja",
      "ko",
      "zh-Hans",
      "zh-Hant",
      "hi",
      "th",
      "vi",
      "ms",
      "id",
      "fil",
      "ta",
      "bn",
    ],
    supportedCurrencies: ["USD", "JPY", "SGD", "KRW", "INR"],
    status: "Localization Needed",
    translationCompletion: 75,
    localizationCompletion: 71,
  },
  {
    slug: "oceania",
    name: "Australia / Oceania",
    enabled: true,
    supportedLanguages: ["en"],
    supportedCurrencies: ["AUD", "NZD"],
    status: "Ready for Publication",
    translationCompletion: 100,
    localizationCompletion: 100,
  },
];

const COUNTRY_CONFIGS: CountryConfiguration[] = [
  { countryCode: "US", country: "United States", region: "north-america" },
  { countryCode: "CA", country: "Canada", region: "north-america" },
  { countryCode: "DO", country: "Dominican Republic", region: "caribbean" },
  { countryCode: "ES", country: "Spain", region: "europe-2a" },
  { countryCode: "NG", country: "Nigeria", region: "africa" },
  { countryCode: "JP", country: "Japan", region: "asia" },
];

function mergeRegionalContent(
  region: RegionSlug,
  countryCode?: string
): RegionalContent {
  const globalCore = CONTENT_LAYERS.globalCore;
  const regionalOverride = CONTENT_LAYERS.regionalOverrides[region] ?? {};
  const countryOverride = countryCode
    ? CONTENT_LAYERS.countryOverrides[countryCode.toUpperCase()] ?? {}
    : {};

  return {
    ...globalCore,
    ...regionalOverride,
    ...countryOverride,
    legalNotices: {
      ...globalCore.legalNotices,
      ...(regionalOverride.legalNotices ?? {}),
      ...(countryOverride.legalNotices ?? {}),
    },
    localizationAssets: {
      ...globalCore.localizationAssets,
      ...(regionalOverride.localizationAssets ?? {}),
      ...(countryOverride.localizationAssets ?? {}),
    },
    educationalExamples: {
      ...globalCore.educationalExamples,
      ...(regionalOverride.educationalExamples ?? {}),
      ...(countryOverride.educationalExamples ?? {}),
    },
    taxDisclaimers:
      countryOverride.taxDisclaimers ??
      regionalOverride.taxDisclaimers ??
      globalCore.taxDisclaimers,
    consumerDisclosures:
      countryOverride.consumerDisclosures ??
      regionalOverride.consumerDisclosures ??
      globalCore.consumerDisclosures,
    paymentProviders:
      countryOverride.paymentProviders ??
      regionalOverride.paymentProviders ??
      globalCore.paymentProviders,
  };
}

export function resolveRegionFromCountry(countryCode?: string): RegionSlug {
  const country = countryCode
    ? COUNTRY_CONFIGS.find(
        (entry) => entry.countryCode === countryCode.toUpperCase()
      )
    : undefined;

  return country?.region ?? "north-america";
}

export function resolveRegionalization(
  options: {
    region?: RegionSlug;
    countryCode?: string;
    userPreferredLanguage?: string;
  } = {}
): RegionalizationResolution {
  const countryCode = options.countryCode?.toUpperCase();
  const region = options.region ?? resolveRegionFromCountry(countryCode);
  const regionConfig =
    REGION_CONFIGS.find((entry) => entry.slug === region) ?? REGION_CONFIGS[0];
  const merged = mergeRegionalContent(region, countryCode);

  return {
    region,
    countryCode,
    interfaceLanguage: normalizeInterfaceLanguage(options.userPreferredLanguage),
    currency: merged.currency,
    legalNotices: merged.legalNotices,
    taxDisclaimers: merged.taxDisclaimers,
    consumerDisclosures: merged.consumerDisclosures,
    paymentProviders: merged.paymentProviders,
    localizationAssets: merged.localizationAssets,
    educationalExamples: merged.educationalExamples,
    status: regionConfig.status,
    translationCompletion: regionConfig.translationCompletion,
    localizationCompletion: regionConfig.localizationCompletion,
    ai: {
      regionalExampleRecommendation:
        "Placeholder: AI can suggest local examples while preserving the global lesson concept.",
      regionalLegalReviewFlag:
        "Placeholder: AI can flag legal text requiring counsel review.",
      translationSuggestion:
        "Placeholder: AI can suggest translation drafts for untranslated strings.",
      currencyConversionHint:
        "Placeholder: AI can suggest conversion ranges; no payment processing impact.",
    },
  };
}

function normalizeInterfaceLanguage(languageCode: string | undefined) {
  if (!languageCode) {
    return "en";
  }

  const normalized = languageCode.trim().toLowerCase();

  if (normalized === "zh" || normalized === "zh-cn" || normalized === "zh-hans") {
    return "zh-Hans";
  }

  if (normalized === "zh-tw" || normalized === "zh-hk" || normalized === "zh-hant") {
    return "zh-Hant";
  }

  if (normalized === "tl") {
    return "fil";
  }

  return normalized;
}

export function loadRegionalLegalNotices(
  options: { region?: RegionSlug; countryCode?: string } = {}
): Record<LegalNoticeType, string> {
  return resolveRegionalization(options).legalNotices;
}

export function loadRegionalCurrency(
  options: { region?: RegionSlug; countryCode?: string } = {}
): string {
  return resolveRegionalization(options).currency;
}

export function resolvePaymentRouting(
  options: { region?: RegionSlug; countryCode?: string } = {}
): PaymentProvider[] {
  return resolveRegionalization(options).paymentProviders;
}

export function getRegionalManagementRows() {
  return REGION_CONFIGS.map((region) => ({
    ...region,
    legalNoticeCount: Object.keys(
      loadRegionalLegalNotices({ region: region.slug })
    ).length,
  }));
}
