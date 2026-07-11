export type LaunchAudience = "public" | "founders" | "betaTesters";

export interface LaunchControls {
  public: boolean;
  founders: boolean;
  betaTesters: boolean;
}

export interface RegionalLocale {
  code: string;
  label: string;
  nativeLabel: string;
  locale: string;
  hreflang: string;
}

export interface RegionalCurrency {
  code: string;
  symbol: string;
}

export interface RegionalPricingDefinition {
  assessment: number;
  monthly: number;
  annual: number;
  microCourse: number;
  flagshipCourse: number;
  book: number;
  audioBook: number;
}

export interface RegionalTaxConfiguration {
  model: "gst" | "consumption-tax";
  rate: number;
  taxInclusive: boolean;
  registrationThreshold?: string;
}

export interface RegionalComplianceConfiguration {
  reviewStatus: "planning" | "private-beta";
  frameworks: string[];
  dataResidency: string;
  payoutControls: string[];
}

export interface RegionalCapabilityConfiguration {
  marketplace: boolean;
  payments: boolean;
  courses: boolean;
  assessments: boolean;
  hiring: boolean;
  ai: boolean;
  founderControls: boolean;
  betaTesterControls: boolean;
}

export interface RegionalSeoConfiguration {
  locale: string;
  alternateLocales: string[];
  pathPrefix: string;
  indexable: boolean;
}

export interface ApacFoundationCountry {
  id: string;
  isoCode: string;
  country: string;
  continent: "Asia" | "Oceania";
  timezone: string;
  status: "planning" | "beta";
  operatingEntity: string;
  languages: RegionalLocale[];
  currency: RegionalCurrency;
  paymentProviders: string[];
  pricing: RegionalPricingDefinition;
  tax: RegionalTaxConfiguration;
  compliance: RegionalComplianceConfiguration;
  capabilities: RegionalCapabilityConfiguration;
  launchControls: LaunchControls;
  seo: RegionalSeoConfiguration;
}

export interface ApacFoundationFeatureFlags {
  region: boolean;
  pricing: boolean;
  tax: boolean;
  compliance: boolean;
  seo: boolean;
  founderControls: boolean;
  betaTesterControls: boolean;
}

export const APAC_FOUNDATION_FLAGS: ApacFoundationFeatureFlags = {
  region: false,
  pricing: false,
  tax: false,
  compliance: false,
  seo: false,
  founderControls: false,
  betaTesterControls: false,
};

export const APAC_FOUNDATION_COUNTRIES: ApacFoundationCountry[] = [
  {
    id: "sg",
    isoCode: "SG",
    country: "Singapore",
    continent: "Asia",
    timezone: "Asia/Singapore",
    status: "beta",
    operatingEntity: "Edge Financial APAC",
    languages: [
      { code: "en", label: "English", nativeLabel: "English", locale: "en-SG", hreflang: "en-SG" },
      { code: "zh", label: "Chinese", nativeLabel: "中文", locale: "zh-SG", hreflang: "zh-SG" },
      { code: "ms", label: "Malay", nativeLabel: "Bahasa Melayu", locale: "ms-SG", hreflang: "ms-SG" },
    ],
    currency: { code: "SGD", symbol: "S$" },
    paymentProviders: ["Stripe", "PayPal"],
    pricing: {
      assessment: 39,
      monthly: 24,
      annual: 239,
      microCourse: 35,
      flagshipCourse: 189,
      book: 24,
      audioBook: 18,
    },
    tax: {
      model: "gst",
      rate: 9,
      taxInclusive: true,
      registrationThreshold: "SGD 1M",
    },
    compliance: {
      reviewStatus: "private-beta",
      frameworks: ["PDPA", "MAS-ready payments review", "GST invoicing"],
      dataResidency: "APAC regional cloud",
      payoutControls: ["Manual settlement review", "Founder approval required"],
    },
    capabilities: {
      marketplace: true,
      payments: true,
      courses: true,
      assessments: true,
      hiring: true,
      ai: true,
      founderControls: true,
      betaTesterControls: true,
    },
    launchControls: {
      public: false,
      founders: true,
      betaTesters: true,
    },
    seo: {
      locale: "en_SG",
      alternateLocales: ["zh_SG", "ms_SG"],
      pathPrefix: "/sg",
      indexable: false,
    },
  },
  {
    id: "ph",
    isoCode: "PH",
    country: "Philippines",
    continent: "Asia",
    timezone: "Asia/Manila",
    status: "planning",
    operatingEntity: "Edge Financial APAC",
    languages: [
      { code: "en", label: "English", nativeLabel: "English", locale: "en-PH", hreflang: "en-PH" },
      { code: "fil", label: "Filipino", nativeLabel: "Filipino", locale: "fil-PH", hreflang: "fil-PH" },
    ],
    currency: { code: "PHP", symbol: "₱" },
    paymentProviders: ["PayPal"],
    pricing: {
      assessment: 690,
      monthly: 399,
      annual: 3990,
      microCourse: 299,
      flagshipCourse: 3490,
      book: 490,
      audioBook: 290,
    },
    tax: {
      model: "consumption-tax",
      rate: 12,
      taxInclusive: true,
    },
    compliance: {
      reviewStatus: "planning",
      frameworks: ["Data Privacy Act", "VAT invoicing", "E-wallet settlement review"],
      dataResidency: "APAC regional cloud",
      payoutControls: ["Manual onboarding review"],
    },
    capabilities: {
      marketplace: true,
      payments: true,
      courses: true,
      assessments: true,
      hiring: true,
      ai: true,
      founderControls: true,
      betaTesterControls: true,
    },
    launchControls: {
      public: false,
      founders: true,
      betaTesters: false,
    },
    seo: {
      locale: "en_PH",
      alternateLocales: ["fil_PH"],
      pathPrefix: "/ph",
      indexable: false,
    },
  },
  {
    id: "in",
    isoCode: "IN",
    country: "India",
    continent: "Asia",
    timezone: "Asia/Kolkata",
    status: "planning",
    operatingEntity: "Edge Financial APAC",
    languages: [
      { code: "en", label: "English", nativeLabel: "English", locale: "en-IN", hreflang: "en-IN" },
      { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", locale: "hi-IN", hreflang: "hi-IN" },
    ],
    currency: { code: "INR", symbol: "₹" },
    paymentProviders: ["PayPal"],
    pricing: {
      assessment: 799,
      monthly: 499,
      annual: 4999,
      microCourse: 399,
      flagshipCourse: 3999,
      book: 599,
      audioBook: 349,
    },
    tax: {
      model: "gst",
      rate: 18,
      taxInclusive: true,
      registrationThreshold: "INR 2M",
    },
    compliance: {
      reviewStatus: "planning",
      frameworks: ["GST invoices", "DPDP Act readiness", "RBI settlement review"],
      dataResidency: "India and APAC regional cloud",
      payoutControls: ["Manual finance review", "Launch sign-off required"],
    },
    capabilities: {
      marketplace: true,
      payments: true,
      courses: true,
      assessments: true,
      hiring: true,
      ai: true,
      founderControls: true,
      betaTesterControls: true,
    },
    launchControls: {
      public: false,
      founders: true,
      betaTesters: false,
    },
    seo: {
      locale: "en_IN",
      alternateLocales: ["hi_IN"],
      pathPrefix: "/in",
      indexable: false,
    },
  },
  {
    id: "jp",
    isoCode: "JP",
    country: "Japan",
    continent: "Asia",
    timezone: "Asia/Tokyo",
    status: "planning",
    operatingEntity: "Edge Financial APAC",
    languages: [
      { code: "ja", label: "Japanese", nativeLabel: "日本語", locale: "ja-JP", hreflang: "ja-JP" },
      { code: "en", label: "English", nativeLabel: "English", locale: "en-JP", hreflang: "en-JP" },
    ],
    currency: { code: "JPY", symbol: "¥" },
    paymentProviders: ["Stripe"],
    pricing: {
      assessment: 3900,
      monthly: 2400,
      annual: 24000,
      microCourse: 1900,
      flagshipCourse: 18900,
      book: 2400,
      audioBook: 1600,
    },
    tax: {
      model: "consumption-tax",
      rate: 10,
      taxInclusive: true,
    },
    compliance: {
      reviewStatus: "planning",
      frameworks: ["APPI readiness", "Consumption tax invoices", "Settlement control review"],
      dataResidency: "Japan and APAC regional cloud",
      payoutControls: ["Manual payout release"],
    },
    capabilities: {
      marketplace: true,
      payments: true,
      courses: true,
      assessments: true,
      hiring: true,
      ai: true,
      founderControls: true,
      betaTesterControls: true,
    },
    launchControls: {
      public: false,
      founders: false,
      betaTesters: false,
    },
    seo: {
      locale: "ja_JP",
      alternateLocales: ["en_JP"],
      pathPrefix: "/jp",
      indexable: false,
    },
  },
  {
    id: "au",
    isoCode: "AU",
    country: "Australia",
    continent: "Oceania",
    timezone: "Australia/Sydney",
    status: "planning",
    operatingEntity: "Edge Financial APAC",
    languages: [
      { code: "en", label: "English", nativeLabel: "English", locale: "en-AU", hreflang: "en-AU" },
    ],
    currency: { code: "AUD", symbol: "A$" },
    paymentProviders: ["Stripe", "PayPal"],
    pricing: {
      assessment: 44,
      monthly: 29,
      annual: 289,
      microCourse: 39,
      flagshipCourse: 199,
      book: 29,
      audioBook: 19,
    },
    tax: {
      model: "gst",
      rate: 10,
      taxInclusive: true,
      registrationThreshold: "AUD 75K",
    },
    compliance: {
      reviewStatus: "planning",
      frameworks: ["Privacy Act", "GST invoicing", "Chargeback review"],
      dataResidency: "Australia and APAC regional cloud",
      payoutControls: ["Manual settlement review"],
    },
    capabilities: {
      marketplace: true,
      payments: true,
      courses: true,
      assessments: true,
      hiring: true,
      ai: true,
      founderControls: true,
      betaTesterControls: true,
    },
    launchControls: {
      public: false,
      founders: true,
      betaTesters: false,
    },
    seo: {
      locale: "en_AU",
      alternateLocales: [],
      pathPrefix: "/au",
      indexable: false,
    },
  },
];

export const APAC_LANGUAGE_REGISTRY = APAC_FOUNDATION_COUNTRIES.flatMap(
  (country) => country.languages,
).filter(
  (locale, index, locales) =>
    locales.findIndex((candidate) => candidate.code === locale.code) === index,
);

export const APAC_CURRENCY_REGISTRY = APAC_FOUNDATION_COUNTRIES.map(
  (country) => country.currency,
).filter(
  (currency, index, currencies) =>
    currencies.findIndex((candidate) => candidate.code === currency.code) === index,
);

export function getApacCountry(countryId: string) {
  return APAC_FOUNDATION_COUNTRIES.find((country) => country.id === countryId);
}

export function isApacAudienceEnabled(
  countryId: string,
  audience: LaunchAudience,
): boolean {
  const country = getApacCountry(countryId);

  if (!country || !APAC_FOUNDATION_FLAGS.region) {
    return false;
  }

  if (audience === "public") {
    return country.launchControls.public;
  }

  if (audience === "founders") {
    return APAC_FOUNDATION_FLAGS.founderControls && country.launchControls.founders;
  }

  return APAC_FOUNDATION_FLAGS.betaTesterControls && country.launchControls.betaTesters;
}
