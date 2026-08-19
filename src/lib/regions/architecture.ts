export type RegionLaunchState = "ACTIVE" | "PRIVATE" | "BETA" | "DISABLED";
export type RegionalSubregion = "north-america" | "central-america" | "south-america" | "caribbean" | "other";
export type CountryActivationPolicy = "standard" | "sanctions-review";

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
  subregion?: RegionalSubregion;
  taxAdapter?: "us-sales-tax" | "canada-indirect-tax" | "vat" | "gst" | "custom";
  launchState?: RegionLaunchState;
  activationPolicy?: CountryActivationPolicy;
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

const PRIVATE: RegionLaunchState = "PRIVATE";
const customTax = "custom" as const;

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
      { countryCode: "US", name: "United States", currencies: ["USD"], languages: ["en", "es"], subregion: "north-america", taxAdapter: "us-sales-tax", launchState: "ACTIVE" },
      { countryCode: "CA", name: "Canada", currencies: ["CAD"], languages: ["en", "fr"], subregion: "north-america", taxAdapter: "canada-indirect-tax", launchState: "ACTIVE" },
    ],
  },
  europe: {
    code: "europe", name: "Europe", routeSlug: "europe", launchState: PRIVATE, defaultLanguage: "en",
    languages: ["en", "es", "fr", "de", "it", "pt", "nl"], currencies: ["EUR", "GBP", "CHF"], countries: [],
    privacyFrameworks: ["GDPR"], taxFrameworks: ["VAT"],
  },
  "latin-america": {
    code: "latin-america", name: "Latin America", routeSlug: "latam", launchState: PRIVATE, defaultLanguage: "es",
    languages: ["es", "pt", "en"],
    currencies: ["ARS", "BOB", "BRL", "CLP", "COP", "CRC", "GTQ", "HNL", "NIO", "PAB", "PYG", "PEN", "SRD", "USD", "UYU", "VES", "BZD", "GYD"],
    privacyFrameworks: ["country-specific-data-protection"],
    taxFrameworks: ["VAT", "GST", "sales-tax", "custom"],
    countries: [
      { countryCode: "BZ", name: "Belize", currencies: ["BZD"], languages: ["en", "es"], subregion: "central-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "CR", name: "Costa Rica", currencies: ["CRC"], languages: ["es", "en"], subregion: "central-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "SV", name: "El Salvador", currencies: ["USD"], languages: ["es", "en"], subregion: "central-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "GT", name: "Guatemala", currencies: ["GTQ"], languages: ["es"], subregion: "central-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "HN", name: "Honduras", currencies: ["HNL"], languages: ["es"], subregion: "central-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "NI", name: "Nicaragua", currencies: ["NIO"], languages: ["es"], subregion: "central-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "PA", name: "Panama", currencies: ["PAB", "USD"], languages: ["es", "en"], subregion: "central-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "AR", name: "Argentina", currencies: ["ARS"], languages: ["es"], subregion: "south-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "BO", name: "Bolivia", currencies: ["BOB"], languages: ["es"], subregion: "south-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "BR", name: "Brazil", currencies: ["BRL"], languages: ["pt"], subregion: "south-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "CL", name: "Chile", currencies: ["CLP"], languages: ["es"], subregion: "south-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "CO", name: "Colombia", currencies: ["COP"], languages: ["es"], subregion: "south-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "EC", name: "Ecuador", currencies: ["USD"], languages: ["es"], subregion: "south-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "GY", name: "Guyana", currencies: ["GYD"], languages: ["en"], subregion: "south-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "PY", name: "Paraguay", currencies: ["PYG"], languages: ["es"], subregion: "south-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "PE", name: "Peru", currencies: ["PEN"], languages: ["es"], subregion: "south-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "SR", name: "Suriname", currencies: ["SRD"], languages: ["nl"], subregion: "south-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "UY", name: "Uruguay", currencies: ["UYU"], languages: ["es"], subregion: "south-america", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "VE", name: "Venezuela", currencies: ["VES"], languages: ["es"], subregion: "south-america", taxAdapter: customTax, launchState: PRIVATE },
    ],
  },
  caribbean: {
    code: "caribbean", name: "Caribbean", routeSlug: "caribbean", launchState: PRIVATE, defaultLanguage: "en",
    languages: ["en", "es", "fr", "nl", "ht", "pap"],
    currencies: ["BBD", "BSD", "CUP", "DOP", "HTG", "JMD", "TTD", "USD", "XCD"],
    privacyFrameworks: ["country-specific-data-protection"],
    taxFrameworks: ["VAT", "GST", "sales-tax", "custom"],
    countries: [
      { countryCode: "AG", name: "Antigua and Barbuda", currencies: ["XCD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "BS", name: "Bahamas", currencies: ["BSD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "BB", name: "Barbados", currencies: ["BBD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "CU", name: "Cuba", currencies: ["CUP"], languages: ["es"], subregion: "caribbean", taxAdapter: customTax, launchState: "DISABLED", activationPolicy: "sanctions-review" },
      { countryCode: "DM", name: "Dominica", currencies: ["XCD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "DO", name: "Dominican Republic", currencies: ["DOP"], languages: ["es"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "GD", name: "Grenada", currencies: ["XCD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "HT", name: "Haiti", currencies: ["HTG"], languages: ["ht", "fr"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "JM", name: "Jamaica", currencies: ["JMD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "KN", name: "Saint Kitts and Nevis", currencies: ["XCD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "LC", name: "Saint Lucia", currencies: ["XCD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "VC", name: "Saint Vincent and the Grenadines", currencies: ["XCD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "TT", name: "Trinidad and Tobago", currencies: ["TTD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
    ],
  },
  africa: {
    code: "africa", name: "Africa", routeSlug: "africa", launchState: PRIVATE, defaultLanguage: "en",
    languages: ["en", "fr", "ar", "pt"], currencies: [], countries: [], privacyFrameworks: [], taxFrameworks: ["VAT", "GST", "custom"],
  },
  mena: {
    code: "mena", name: "Middle East & North Africa", routeSlug: "mena", launchState: PRIVATE, defaultLanguage: "en",
    languages: ["ar", "en", "fr"], currencies: [], countries: [], privacyFrameworks: [], taxFrameworks: ["VAT", "custom"],
  },
  "asia-pacific": {
    code: "asia-pacific", name: "Asia Pacific", routeSlug: "asia-pacific", launchState: PRIVATE, defaultLanguage: "en",
    languages: ["en"], currencies: [], countries: [], privacyFrameworks: [], taxFrameworks: ["VAT", "GST", "custom"],
  },
  oceania: {
    code: "oceania", name: "Oceania", routeSlug: "oceania", launchState: PRIVATE, defaultLanguage: "en",
    languages: ["en"], currencies: ["AUD", "NZD"], countries: [], privacyFrameworks: [], taxFrameworks: ["GST"],
  },
};

export function getRegionArchitecture(code: CanonicalRegionCode): RegionArchitectureConfig { return REGION_ARCHITECTURE[code]; }
export function isPublicRegion(code: CanonicalRegionCode): boolean { return REGION_ARCHITECTURE[code].launchState === "ACTIVE"; }
