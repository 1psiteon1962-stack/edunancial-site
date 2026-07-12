import { CANADIAN_PROVINCES } from "./provinces";

export const CANADA_REGION_CONFIG = {
  countryCode: "CA",
  countryName: "Canada",
  countryNameFr: "Canada",

  currency: "CAD",
  currencySymbol: "CA$",

  defaultLanguage: "en",
  supportedLanguages: ["en", "fr"],
  quebecLanguage: "fr",

  defaultTimezone: "America/Toronto",

  measurementSystem: "metric" as const,

  dateFormat: "YYYY-MM-DD",
  numberFormat: "1,234.56",
  phoneFormat: "+1 (###) ###-####",
  addressFormat: "street-city-province-postal-country",

  privacyFramework: "PIPEDA",
  privacyPolicyPath: "/legal/pipeda",

  analytics: {
    regionTag: "CA",
    continentTag: "north-america",
    dimensionKey: "canada",
  },

  seo: {
    hreflangEnCa: "en-CA",
    hreflangFrCa: "fr-CA",
    canonicalBase: "https://www.edunancial.com/canada",
    ogLocaleEnCa: "en_CA",
    ogLocaleFrCa: "fr_CA",
    siteName: "Edunancial Canada",
  },

  redirects: {
    inboundPattern: "/ca/*",
    canonicalPath: "/canada",
  },

  provinces: CANADIAN_PROVINCES,
};

export type CanadaRegionConfig = typeof CANADA_REGION_CONFIG;

export { CANADIAN_PROVINCES } from "./provinces";
export type {
  CanadianProvinceConfig,
  ProvinceTaxConfig,
  ProvinceTaxModel,
} from "./provinces";
export {
  getProvinceByCode,
  getProvinceTax,
  isQuebec,
  getDefaultLanguageForProvince,
} from "./provinces";
