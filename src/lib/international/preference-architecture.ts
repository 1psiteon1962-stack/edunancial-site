export type MeasurementSystem = "metric" | "imperial";
export type LanguageSelectionSource = "detected" | "user-confirmed";
export type RegionId =
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

export type PaymentMethodId =
  | "stripe"
  | "square"
  | "paypal"
  | "flutterwave"
  | "paystack"
  | "mobile-money"
  | "regional-gateway";

export interface GlobalUserPreferences {
  preferredLanguage: string;
  preferredCurrency: string;
  country: string;
  region: RegionId | string;
  timeZone: string;
  dateFormat: string;
  numberFormat: string;
  measurementSystem: MeasurementSystem;
  preferredPaymentMethod: PaymentMethodId | string;
  languageSelectionSource: LanguageSelectionSource;
}

export interface RegionalPreferenceConfiguration {
  region: RegionId;
  availableProducts: string[];
  pricingModel: string;
  taxEngine: "sales-tax" | "vat" | "gst" | "mixed";
  paymentMethods: PaymentMethodId[];
  supportedCurrencies: string[];
  seoKey: string;
  deploymentTier: "global" | "regional";
}

export interface CountryComplianceConfiguration {
  country: string;
  privacyRegulations: string[];
  taxModel: string;
  consumerProtectionNotices: string[];
}

export const REGIONAL_PREFERENCE_CONFIG: Record<RegionId, RegionalPreferenceConfiguration> = {
  "north-america": {
    region: "north-america",
    availableProducts: ["membership", "courses", "marketplace"],
    pricingModel: "north-america-standard",
    taxEngine: "sales-tax",
    paymentMethods: ["square", "stripe", "paypal"],
    supportedCurrencies: ["USD", "CAD"],
    seoKey: "na",
    deploymentTier: "regional",
  },
  "latin-america-2a": {
    region: "latin-america-2a",
    availableProducts: ["membership", "courses"],
    pricingModel: "latam-2a",
    taxEngine: "mixed",
    paymentMethods: ["stripe", "paypal"],
    supportedCurrencies: ["USD", "MXN", "COP", "PEN"],
    seoKey: "latam-2a",
    deploymentTier: "regional",
  },
  "latin-america-2b": {
    region: "latin-america-2b",
    availableProducts: ["membership", "courses"],
    pricingModel: "latam-2b",
    taxEngine: "mixed",
    paymentMethods: ["stripe", "paypal"],
    supportedCurrencies: ["USD", "BRL", "ARS", "CLP"],
    seoKey: "latam-2b",
    deploymentTier: "regional",
  },
  caribbean: {
    region: "caribbean",
    availableProducts: ["membership", "courses"],
    pricingModel: "caribbean-standard",
    taxEngine: "mixed",
    paymentMethods: ["stripe", "paypal"],
    supportedCurrencies: ["USD", "DOP", "JMD"],
    seoKey: "caribbean",
    deploymentTier: "regional",
  },
  "europe-2a": {
    region: "europe-2a",
    availableProducts: ["membership", "courses"],
    pricingModel: "europe-2a",
    taxEngine: "vat",
    paymentMethods: ["stripe", "paypal"],
    supportedCurrencies: ["EUR", "GBP", "CHF"],
    seoKey: "europe-2a",
    deploymentTier: "regional",
  },
  "europe-2b": {
    region: "europe-2b",
    availableProducts: ["membership", "courses"],
    pricingModel: "europe-2b",
    taxEngine: "vat",
    paymentMethods: ["stripe", "paypal"],
    supportedCurrencies: ["EUR", "PLN", "CZK", "HUF"],
    seoKey: "europe-2b",
    deploymentTier: "regional",
  },
  africa: {
    region: "africa",
    availableProducts: ["membership", "courses"],
    pricingModel: "africa-standard",
    taxEngine: "vat",
    paymentMethods: ["flutterwave", "paystack", "mobile-money", "stripe"],
    supportedCurrencies: ["USD", "NGN", "KES", "ZAR", "EGP"],
    seoKey: "africa",
    deploymentTier: "regional",
  },
  "middle-east": {
    region: "middle-east",
    availableProducts: ["membership", "courses"],
    pricingModel: "mena-standard",
    taxEngine: "vat",
    paymentMethods: ["regional-gateway", "stripe", "paypal"],
    supportedCurrencies: ["USD", "AED", "SAR", "QAR"],
    seoKey: "middle-east",
    deploymentTier: "regional",
  },
  asia: {
    region: "asia",
    availableProducts: ["membership", "courses"],
    pricingModel: "asia-standard",
    taxEngine: "gst",
    paymentMethods: ["regional-gateway", "stripe", "paypal"],
    supportedCurrencies: ["USD", "JPY", "SGD", "KRW", "INR"],
    seoKey: "asia",
    deploymentTier: "regional",
  },
  oceania: {
    region: "oceania",
    availableProducts: ["membership", "courses"],
    pricingModel: "oceania-standard",
    taxEngine: "gst",
    paymentMethods: ["stripe", "paypal"],
    supportedCurrencies: ["AUD", "NZD"],
    seoKey: "oceania",
    deploymentTier: "regional",
  },
};

export const COUNTRY_COMPLIANCE_CONFIG: Record<string, CountryComplianceConfiguration> = {
  US: {
    country: "US",
    privacyRegulations: ["ccpa-cpra", "privacy-notice"],
    taxModel: "sales-tax",
    consumerProtectionNotices: ["us-consumer-rights"],
  },
  CA: {
    country: "CA",
    privacyRegulations: ["pipeda", "privacy-notice"],
    taxModel: "mixed",
    consumerProtectionNotices: ["ca-consumer-rights"],
  },
  ES: {
    country: "ES",
    privacyRegulations: ["gdpr", "privacy-notice"],
    taxModel: "vat",
    consumerProtectionNotices: ["eu-consumer-rights"],
  },
  NG: {
    country: "NG",
    privacyRegulations: ["privacy-notice"],
    taxModel: "vat",
    consumerProtectionNotices: ["ng-consumer-rights"],
  },
};

const DEFAULT_REGION: RegionId = "north-america";
const DEFAULT_PAYMENT_METHOD: PaymentMethodId = "stripe";

export function getRegionPreferenceConfiguration(region: string) {
  return REGIONAL_PREFERENCE_CONFIG[region as RegionId] ?? REGIONAL_PREFERENCE_CONFIG[DEFAULT_REGION];
}

export function resolveAvailablePaymentMethods(region: string, countryCode?: string) {
  const regionalMethods = getRegionPreferenceConfiguration(region).paymentMethods;
  if (countryCode?.toUpperCase() === "US") {
    return ["square", ...regionalMethods.filter((method) => method !== "square")];
  }
  return regionalMethods;
}

export function resolveDefaultPaymentMethod(region: string, countryCode?: string) {
  const methods = resolveAvailablePaymentMethods(region, countryCode);
  return methods[0] ?? DEFAULT_PAYMENT_METHOD;
}
