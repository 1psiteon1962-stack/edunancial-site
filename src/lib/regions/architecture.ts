export type RegionLaunchState = "ACTIVE" | "PRIVATE" | "BETA" | "DISABLED";

export type CanonicalRegionCode =
  | "north-america"
  | "europe"
  | "latin-america"
  | "caribbean"
  | "africa"
  | "mena"
  | "asia-pacific"
  | "oceania";

export interface CountryArchitectureConfig {
  countryCode: string;
  name: string;
  currencies: string[];
  languages: string[];
  taxAdapter?: "us-sales-tax" | "canada-indirect-tax" | "vat" | "gst" | "custom";
  launchState?: RegionLaunchState;
}

export interface RegionArchitectureConfig {
  code: CanonicalRegionCode;
  name: string;
  routeSlug: string;
  launchState: RegionLaunchState;
  defaultLanguage: string;
  languages: string[];
  currencies: string[];
  countries: CountryArchitectureConfig[];
  privacyFrameworks: string[];
  taxFrameworks: string[];
}

export const REGION_ARCHITECTURE: Record<CanonicalRegionCode, RegionArchitectureConfig> = {
  "north-america": {
    code: "north-america",
    name: "North America",
    routeSlug: "north-america",
    launchState: "ACTIVE",
    defaultLanguage: "en",
    languages: ["en", "es", "fr"],
    currencies: ["USD", "CAD"],
    privacyFrameworks: ["US-state-privacy", "PIPEDA", "Quebec-Law-25"],
    taxFrameworks: ["US-sales-tax", "GST-HST", "PST-RST", "QST"],
    countries: [
      { countryCode: "US", name: "United States", currencies: ["USD"], languages: ["en", "es"], taxAdapter: "us-sales-tax", launchState: "ACTIVE" },
      { countryCode: "CA", name: "Canada", currencies: ["CAD"], languages: ["en", "fr"], taxAdapter: "canada-indirect-tax", launchState: "ACTIVE" },
    ],
  },
  europe: {
    code: "europe", name: "Europe", routeSlug: "europe", launchState: "PRIVATE", defaultLanguage: "en",
    languages: ["en", "es", "fr", "de", "it", "pt", "nl"], currencies: ["EUR", "GBP", "CHF"], countries: [],
    privacyFrameworks: ["GDPR"], taxFrameworks: ["VAT"],
  },
  "latin-america": {
    code: "latin-america", name: "Latin America", routeSlug: "latam", launchState: "PRIVATE", defaultLanguage: "es",
    languages: ["es", "pt", "en"], currencies: [], countries: [], privacyFrameworks: [], taxFrameworks: ["VAT", "GST", "custom"],
  },
  caribbean: {
    code: "caribbean", name: "Caribbean", routeSlug: "caribbean", launchState: "PRIVATE", defaultLanguage: "en",
    languages: ["en", "es", "fr", "nl", "ht", "pap"], currencies: [], countries: [], privacyFrameworks: [], taxFrameworks: ["VAT", "GST", "custom"],
  },
  africa: {
    code: "africa", name: "Africa", routeSlug: "africa", launchState: "PRIVATE", defaultLanguage: "en",
    languages: ["en", "fr", "ar", "pt"], currencies: [], countries: [], privacyFrameworks: [], taxFrameworks: ["VAT", "GST", "custom"],
  },
  mena: {
    code: "mena", name: "Middle East & North Africa", routeSlug: "mena", launchState: "PRIVATE", defaultLanguage: "en",
    languages: ["ar", "en", "fr"], currencies: [], countries: [], privacyFrameworks: [], taxFrameworks: ["VAT", "custom"],
  },
  "asia-pacific": {
    code: "asia-pacific", name: "Asia Pacific", routeSlug: "asia-pacific", launchState: "PRIVATE", defaultLanguage: "en",
    languages: ["en"], currencies: [], countries: [], privacyFrameworks: [], taxFrameworks: ["VAT", "GST", "custom"],
  },
  oceania: {
    code: "oceania", name: "Oceania", routeSlug: "oceania", launchState: "PRIVATE", defaultLanguage: "en",
    languages: ["en"], currencies: ["AUD", "NZD"], countries: [], privacyFrameworks: [], taxFrameworks: ["GST"],
  },
};

export function getRegionArchitecture(code: CanonicalRegionCode): RegionArchitectureConfig {
  return REGION_ARCHITECTURE[code];
}

export function isPublicRegion(code: CanonicalRegionCode): boolean {
  return REGION_ARCHITECTURE[code].launchState === "ACTIVE";
}
