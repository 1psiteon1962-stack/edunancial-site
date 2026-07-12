export const GLOBAL_REGIONS = [
  "north-america",
  "latin-america",
  "caribbean",
  "europe",
  "africa",
  "middle-east",
  "asia-pacific",
] as const;

export type GlobalRegionId = (typeof GLOBAL_REGIONS)[number];

export type SupportedLanguageCode =
  | "en"
  | "es"
  | "fr"
  | "pt"
  | "de"
  | "it"
  | "nl"
  | "ht"
  | "pap"
  | "ar"
  | "sw"
  | "yo"
  | "zu"
  | "am"
  | "ja"
  | "ko"
  | "zh-Hans"
  | "zh-Hant"
  | "hi"
  | "th"
  | "vi"
  | "ms"
  | "id"
  | "fil"
  | "ta"
  | "bn";

export type RegionalPaymentProviderId =
  | "square"
  | "stripe"
  | "paypal"
  | "flutterwave"
  | "paystack"
  | "mobile-money"
  | "local-eu-methods"
  | "local-latam-gateway"
  | "local-apac-methods";

export interface RegionalTaxSettings {
  model: "sales-tax" | "vat" | "gst" | "mixed";
  pricesIncludeTax: boolean;
  disclaimerKey: string;
}

export interface RegionalDefaultPricing {
  currency: string;
  starterMonthlyAmount: number;
}

export interface RegionalConfiguration {
  id: GlobalRegionId;
  supportedLanguages: SupportedLanguageCode[];
  supportedCurrencies: string[];
  defaultTimeZone: string;
  countries: string[];
  taxSettings: RegionalTaxSettings;
  paymentProviders: RegionalPaymentProviderId[];
  defaultPricing: RegionalDefaultPricing;
}

export const NORTH_AMERICA_REGION: RegionalConfiguration = {
  id: "north-america",
  supportedLanguages: ["en", "es", "fr"],
  supportedCurrencies: ["USD", "CAD"],
  defaultTimeZone: "America/New_York",
  countries: ["US", "CA"],
  taxSettings: {
    model: "sales-tax",
    pricesIncludeTax: false,
    disclaimerKey: "tax.na.disclaimer",
  },
  paymentProviders: ["square"],
  defaultPricing: {
    currency: "USD",
    starterMonthlyAmount: 49,
  },
};

export const REGIONAL_CONFIG: Record<GlobalRegionId, RegionalConfiguration> = {
  "north-america": NORTH_AMERICA_REGION,
  "latin-america": {
    id: "latin-america",
    supportedLanguages: ["es", "pt", "en"],
    supportedCurrencies: ["MXN", "BRL", "COP", "PEN", "USD"],
    defaultTimeZone: "America/Mexico_City",
    countries: ["MX", "BR", "CO", "PE", "AR", "CL"],
    taxSettings: {
      model: "mixed",
      pricesIncludeTax: true,
      disclaimerKey: "tax.latam.disclaimer",
    },
    paymentProviders: ["local-latam-gateway", "stripe"],
    defaultPricing: {
      currency: "USD",
      starterMonthlyAmount: 39,
    },
  },
  caribbean: {
    id: "caribbean",
    supportedLanguages: ["en", "es", "fr", "nl", "ht", "pap"],
    supportedCurrencies: ["USD", "DOP", "JMD", "TTD"],
    defaultTimeZone: "America/Santo_Domingo",
    countries: ["DO", "JM", "TT", "BB", "BS"],
    taxSettings: {
      model: "mixed",
      pricesIncludeTax: true,
      disclaimerKey: "tax.caribbean.disclaimer",
    },
    paymentProviders: ["stripe", "local-latam-gateway"],
    defaultPricing: {
      currency: "USD",
      starterMonthlyAmount: 39,
    },
  },
  europe: {
    id: "europe",
    supportedLanguages: ["en", "fr", "de", "es", "pt", "it", "nl"],
    supportedCurrencies: ["EUR", "GBP", "CHF"],
    defaultTimeZone: "Europe/Paris",
    countries: ["FR", "DE", "ES", "IT", "NL", "BE", "GB", "PT", "CH", "PL", "CZ", "HU", "RO"],
    taxSettings: {
      model: "vat",
      pricesIncludeTax: true,
      disclaimerKey: "tax.eu.disclaimer",
    },
    paymentProviders: ["stripe", "paypal", "local-eu-methods"],
    defaultPricing: {
      currency: "EUR",
      starterMonthlyAmount: 39,
    },
  },
  africa: {
    id: "africa",
    supportedLanguages: ["en", "fr", "ar", "pt", "sw", "yo", "zu", "am"],
    supportedCurrencies: ["NGN", "KES", "ZAR", "GHS", "USD"],
    defaultTimeZone: "Africa/Lagos",
    countries: ["NG", "KE", "ZA", "GH", "UG", "TZ", "EG", "MA"],
    taxSettings: {
      model: "vat",
      pricesIncludeTax: true,
      disclaimerKey: "tax.africa.disclaimer",
    },
    paymentProviders: ["flutterwave", "paystack", "mobile-money", "stripe"],
    defaultPricing: {
      currency: "USD",
      starterMonthlyAmount: 29,
    },
  },
  "middle-east": {
    id: "middle-east",
    supportedLanguages: ["ar", "en", "fr"],
    supportedCurrencies: ["AED", "SAR", "QAR", "USD"],
    defaultTimeZone: "Asia/Riyadh",
    countries: ["AE", "SA", "QA", "KW", "BH", "OM", "JO"],
    taxSettings: {
      model: "vat",
      pricesIncludeTax: true,
      disclaimerKey: "tax.me.disclaimer",
    },
    paymentProviders: ["stripe", "local-apac-methods"],
    defaultPricing: {
      currency: "USD",
      starterMonthlyAmount: 39,
    },
  },
  "asia-pacific": {
    id: "asia-pacific",
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
    supportedCurrencies: ["JPY", "KRW", "CNY", "TWD", "HKD", "SGD", "INR", "AUD", "NZD", "PHP", "THB", "MYR", "IDR", "VND", "USD"],
    defaultTimeZone: "Asia/Singapore",
    countries: ["JP", "KR", "CN", "TW", "HK", "SG", "IN", "AU", "NZ", "PH", "TH", "MY", "ID", "VN"],
    taxSettings: {
      model: "gst",
      pricesIncludeTax: true,
      disclaimerKey: "tax.apac.disclaimer",
    },
    paymentProviders: ["stripe", "local-apac-methods"],
    defaultPricing: {
      currency: "USD",
      starterMonthlyAmount: 39,
    },
  },
};

const COUNTRY_TO_REGION: Record<string, GlobalRegionId> = {
  US: "north-america",
  CA: "north-america",
  MX: "latin-america",
  BR: "latin-america",
  CO: "latin-america",
  PE: "latin-america",
  AR: "latin-america",
  CL: "latin-america",
  DO: "caribbean",
  JM: "caribbean",
  TT: "caribbean",
  BB: "caribbean",
  BS: "caribbean",
  FR: "europe",
  DE: "europe",
  ES: "europe",
  IT: "europe",
  NL: "europe",
  BE: "europe",
  GB: "europe",
  PT: "europe",
  CH: "europe",
  AT: "europe",
  IE: "europe",
  SE: "europe",
  DK: "europe",
  FI: "europe",
  NO: "europe",
  LU: "europe",
  PL: "europe",
  CZ: "europe",
  HU: "europe",
  RO: "europe",
  SK: "europe",
  BG: "europe",
  HR: "europe",
  EE: "europe",
  LV: "europe",
  LT: "europe",
  SI: "europe",
  GR: "europe",
  NG: "africa",
  KE: "africa",
  ZA: "africa",
  GH: "africa",
  UG: "africa",
  TZ: "africa",
  EG: "africa",
  MA: "africa",
  AE: "middle-east",
  SA: "middle-east",
  QA: "middle-east",
  KW: "middle-east",
  BH: "middle-east",
  OM: "middle-east",
  JO: "middle-east",
  JP: "asia-pacific",
  KR: "asia-pacific",
  CN: "asia-pacific",
  TW: "asia-pacific",
  HK: "asia-pacific",
  SG: "asia-pacific",
  IN: "asia-pacific",
  AU: "asia-pacific",
  NZ: "asia-pacific",
  PH: "asia-pacific",
  TH: "asia-pacific",
  MY: "asia-pacific",
  ID: "asia-pacific",
  VN: "asia-pacific",
};

const TIMEZONE_TO_REGION: Record<string, GlobalRegionId> = {
  "America/New_York": "north-america",
  "America/Toronto": "north-america",
  "America/Mexico_City": "latin-america",
  "America/Sao_Paulo": "latin-america",
  "America/Santo_Domingo": "caribbean",
  "Europe/Paris": "europe",
  "Europe/Berlin": "europe",
  "Europe/London": "europe",
  "Europe/Madrid": "europe",
  "Europe/Rome": "europe",
  "Europe/Amsterdam": "europe",
  "Europe/Brussels": "europe",
  "Europe/Lisbon": "europe",
  "Europe/Zurich": "europe",
  "Europe/Warsaw": "europe",
  "Europe/Prague": "europe",
  "Europe/Budapest": "europe",
  "Europe/Bucharest": "europe",
  "Europe/Sofia": "europe",
  "Europe/Zagreb": "europe",
  "Europe/Tallinn": "europe",
  "Europe/Riga": "europe",
  "Europe/Vilnius": "europe",
  "Africa/Lagos": "africa",
  "Africa/Nairobi": "africa",
  "Asia/Riyadh": "middle-east",
  "Asia/Dubai": "middle-east",
  "Asia/Singapore": "asia-pacific",
  "Asia/Tokyo": "asia-pacific",
  "Asia/Seoul": "asia-pacific",
  "Asia/Shanghai": "asia-pacific",
  "Asia/Taipei": "asia-pacific",
  "Asia/Hong_Kong": "asia-pacific",
  "Asia/Kolkata": "asia-pacific",
  "Asia/Manila": "asia-pacific",
  "Asia/Bangkok": "asia-pacific",
  "Asia/Kuala_Lumpur": "asia-pacific",
  "Asia/Jakarta": "asia-pacific",
  "Asia/Ho_Chi_Minh": "asia-pacific",
  "Australia/Sydney": "asia-pacific",
  "Pacific/Auckland": "asia-pacific",
};

export const DEFAULT_REGION_ID: GlobalRegionId = "north-america";

export function resolveRegionId(
  options: { countryCode?: string; timezone?: string } = {}
): GlobalRegionId {
  const countryCode = options.countryCode?.toUpperCase();

  if (countryCode && COUNTRY_TO_REGION[countryCode]) {
    return COUNTRY_TO_REGION[countryCode];
  }

  if (options.timezone && TIMEZONE_TO_REGION[options.timezone]) {
    return TIMEZONE_TO_REGION[options.timezone];
  }

  return DEFAULT_REGION_ID;
}

export function getRegionalConfiguration(
  regionId?: string
): RegionalConfiguration {
  if (!regionId) {
    return REGIONAL_CONFIG[DEFAULT_REGION_ID];
  }

  return (
    REGIONAL_CONFIG[regionId as GlobalRegionId] ?? REGIONAL_CONFIG[DEFAULT_REGION_ID]
  );
}

export function getRegionByCountry(countryCode?: string): GlobalRegionId {
  return resolveRegionId({ countryCode });
}
