export type RegionLaunchState = "ACTIVE" | "PRIVATE" | "BETA" | "DISABLED";
export type CountryActivationPolicy = "standard" | "sanctions-review" | "legal-review" | "business-hold";
export type RegionalSubregion =
  | "north-america"
  | "central-america"
  | "south-america"
  | "caribbean"
  | "western-europe"
  | "eastern-europe"
  | "north-africa"
  | "west-africa"
  | "central-africa"
  | "east-africa"
  | "southern-africa"
  | "middle-east"
  | "developed-asia"
  | "emerging-asia"
  | "oceania"
  | "other";

export type CanonicalRegionCode =
  | "north-america"
  | "europe"
  | "latin-america"
  | "caribbean"
  | "africa"
  | "mena"
  | "asia-pacific"
  | "oceania";

export interface CountryServiceControls {
  publicAccess: boolean;
  registrations: boolean;
  paidCommerce: boolean;
  marketplace: boolean;
  marketing: boolean;
}

export interface OperatingSegmentConfig {
  code: RegionalSubregion;
  name: string;
  deploymentKey: string;
  failureDomain: string;
  telemetryNamespace: string;
  independentRuntime: boolean;
}

export interface CountryArchitectureConfig {
  countryCode: string;
  name: string;
  currencies: string[];
  languages: string[];
  subregion?: RegionalSubregion;
  taxAdapter?: "us-sales-tax" | "canada-indirect-tax" | "vat" | "gst" | "custom";
  launchState?: RegionLaunchState;
  activationPolicy?: CountryActivationPolicy;
  serviceControls?: Partial<CountryServiceControls>;
  telemetryKey?: string;
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
  reportingCurrency?: string;
  telemetryNamespace?: string;
  independentRuntime?: boolean;
  operatingSegments?: OperatingSegmentConfig[];
}

const PRIVATE: RegionLaunchState = "PRIVATE";
const customTax = "custom" as const;
const privateControls: CountryServiceControls = {
  publicAccess: false,
  registrations: false,
  paidCommerce: false,
  marketplace: false,
  marketing: false,
};

function segment(code: RegionalSubregion, name: string, regionKey: string): OperatingSegmentConfig {
  return {
    code,
    name,
    deploymentKey: `${regionKey}-${code}`,
    failureDomain: `${regionKey}-${code}`,
    telemetryNamespace: `edunancial.${regionKey}.${code}`,
    independentRuntime: true,
  };
}

function africaCountry(
  countryCode: string,
  name: string,
  currencies: string[],
  languages: string[],
  subregion: Extract<RegionalSubregion, "north-africa" | "west-africa" | "central-africa" | "east-africa" | "southern-africa">,
): CountryArchitectureConfig {
  return {
    countryCode,
    name,
    currencies,
    languages,
    subregion,
    taxAdapter: customTax,
    launchState: PRIVATE,
    activationPolicy: "standard",
    serviceControls: privateControls,
    telemetryKey: `africa.${subregion}.${countryCode.toLowerCase()}`,
  };
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
    reportingCurrency: "USD",
    telemetryNamespace: "edunancial.north-america",
    independentRuntime: true,
    operatingSegments: [segment("north-america", "North America", "north-america")],
    countries: [
      {
        countryCode: "US", name: "United States", currencies: ["USD"], languages: ["en", "es"], subregion: "north-america",
        taxAdapter: "us-sales-tax", launchState: "ACTIVE", activationPolicy: "standard",
        serviceControls: { publicAccess: true, registrations: true, paidCommerce: true, marketplace: true, marketing: true },
        telemetryKey: "north-america.us",
      },
      {
        countryCode: "CA", name: "Canada", currencies: ["CAD"], languages: ["en", "fr"], subregion: "north-america",
        taxAdapter: "canada-indirect-tax", launchState: "ACTIVE", activationPolicy: "standard",
        serviceControls: { publicAccess: true, registrations: true, paidCommerce: true, marketplace: true, marketing: true },
        telemetryKey: "north-america.ca",
      },
    ],
  },
  europe: {
    code: "europe", name: "Europe", routeSlug: "europe", launchState: PRIVATE, defaultLanguage: "en",
    languages: ["en", "es", "fr", "de", "it", "pt", "nl", "pl"], currencies: ["EUR", "GBP", "CHF"], countries: [],
    privacyFrameworks: ["GDPR"], taxFrameworks: ["VAT"], reportingCurrency: "EUR", telemetryNamespace: "edunancial.europe",
    independentRuntime: true,
    operatingSegments: [
      segment("western-europe", "Western Europe", "europe"),
      segment("eastern-europe", "Eastern Europe", "europe"),
    ],
  },
  "latin-america": {
    code: "latin-america", name: "Latin America", routeSlug: "latam", launchState: PRIVATE, defaultLanguage: "es",
    languages: ["es", "pt", "en"],
    currencies: ["ARS", "BOB", "BRL", "CLP", "COP", "CRC", "GTQ", "HNL", "NIO", "PAB", "PYG", "PEN", "SRD", "USD", "UYU", "VES", "BZD", "GYD"],
    privacyFrameworks: ["country-specific-data-protection"], taxFrameworks: ["VAT", "GST", "sales-tax", "custom"],
    reportingCurrency: "USD", telemetryNamespace: "edunancial.latin-america", independentRuntime: true,
    operatingSegments: [
      segment("central-america", "Central America", "latin-america"),
      segment("south-america", "South America", "latin-america"),
    ],
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
    languages: ["en", "es", "fr", "nl", "ht", "pap"], currencies: ["BBD", "BSD", "CUP", "DOP", "HTG", "JMD", "TTD", "USD", "XCD"],
    privacyFrameworks: ["country-specific-data-protection"], taxFrameworks: ["VAT", "GST", "sales-tax", "custom"],
    reportingCurrency: "USD", telemetryNamespace: "edunancial.caribbean", independentRuntime: true,
    operatingSegments: [segment("caribbean", "Caribbean", "caribbean")],
    countries: [
      { countryCode: "AG", name: "Antigua and Barbuda", currencies: ["XCD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "BS", name: "Bahamas", currencies: ["BSD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      { countryCode: "BB", name: "Barbados", currencies: ["BBD"], languages: ["en"], subregion: "caribbean", taxAdapter: customTax, launchState: PRIVATE },
      {
        countryCode: "CU", name: "Cuba", currencies: ["CUP"], languages: ["es"], subregion: "caribbean", taxAdapter: customTax,
        launchState: "DISABLED", activationPolicy: "sanctions-review", serviceControls: privateControls, telemetryKey: "caribbean.cu",
      },
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
    languages: ["en", "fr", "ar", "pt", "sw"], currencies: [], privacyFrameworks: ["country-specific-data-protection"],
    taxFrameworks: ["VAT", "GST", "custom"], reportingCurrency: "USD", telemetryNamespace: "edunancial.africa", independentRuntime: true,
    operatingSegments: [
      segment("north-africa", "North Africa", "africa"),
      segment("west-africa", "West Africa", "africa"),
      segment("central-africa", "Central Africa", "africa"),
      segment("east-africa", "East Africa", "africa"),
      segment("southern-africa", "Southern Africa", "africa"),
    ],
    countries: [
      africaCountry("DZ", "Algeria", ["DZD"], ["ar", "fr"], "north-africa"),
      africaCountry("EG", "Egypt", ["EGP"], ["ar", "en"], "north-africa"),
      africaCountry("LY", "Libya", ["LYD"], ["ar"], "north-africa"),
      africaCountry("MA", "Morocco", ["MAD"], ["ar", "fr"], "north-africa"),
      africaCountry("SD", "Sudan", ["SDG"], ["ar", "en"], "north-africa"),
      africaCountry("TN", "Tunisia", ["TND"], ["ar", "fr"], "north-africa"),

      africaCountry("BJ", "Benin", ["XOF"], ["fr"], "west-africa"),
      africaCountry("BF", "Burkina Faso", ["XOF"], ["fr"], "west-africa"),
      africaCountry("CV", "Cabo Verde", ["CVE"], ["pt"], "west-africa"),
      africaCountry("CI", "Cote d'Ivoire", ["XOF"], ["fr"], "west-africa"),
      africaCountry("GM", "Gambia", ["GMD"], ["en"], "west-africa"),
      africaCountry("GH", "Ghana", ["GHS"], ["en"], "west-africa"),
      africaCountry("GN", "Guinea", ["GNF"], ["fr"], "west-africa"),
      africaCountry("GW", "Guinea-Bissau", ["XOF"], ["pt"], "west-africa"),
      africaCountry("LR", "Liberia", ["LRD"], ["en"], "west-africa"),
      africaCountry("ML", "Mali", ["XOF"], ["fr"], "west-africa"),
      africaCountry("MR", "Mauritania", ["MRU"], ["ar", "fr"], "west-africa"),
      africaCountry("NE", "Niger", ["XOF"], ["fr"], "west-africa"),
      africaCountry("NG", "Nigeria", ["NGN"], ["en"], "west-africa"),
      africaCountry("SN", "Senegal", ["XOF"], ["fr"], "west-africa"),
      africaCountry("SL", "Sierra Leone", ["SLE"], ["en"], "west-africa"),
      africaCountry("TG", "Togo", ["XOF"], ["fr"], "west-africa"),

      africaCountry("AO", "Angola", ["AOA"], ["pt"], "central-africa"),
      africaCountry("CM", "Cameroon", ["XAF"], ["fr", "en"], "central-africa"),
      africaCountry("CF", "Central African Republic", ["XAF"], ["fr"], "central-africa"),
      africaCountry("TD", "Chad", ["XAF"], ["fr", "ar"], "central-africa"),
      africaCountry("CG", "Republic of the Congo", ["XAF"], ["fr"], "central-africa"),
      africaCountry("CD", "Democratic Republic of the Congo", ["CDF"], ["fr"], "central-africa"),
      africaCountry("GQ", "Equatorial Guinea", ["XAF"], ["es", "fr", "pt"], "central-africa"),
      africaCountry("GA", "Gabon", ["XAF"], ["fr"], "central-africa"),
      africaCountry("ST", "Sao Tome and Principe", ["STN"], ["pt"], "central-africa"),

      africaCountry("BI", "Burundi", ["BIF"], ["fr", "en", "sw"], "east-africa"),
      africaCountry("KM", "Comoros", ["KMF"], ["ar", "fr"], "east-africa"),
      africaCountry("DJ", "Djibouti", ["DJF"], ["fr", "ar"], "east-africa"),
      africaCountry("ER", "Eritrea", ["ERN"], ["ti", "ar", "en"], "east-africa"),
      africaCountry("ET", "Ethiopia", ["ETB"], ["am", "en"], "east-africa"),
      africaCountry("KE", "Kenya", ["KES"], ["en", "sw"], "east-africa"),
      africaCountry("MG", "Madagascar", ["MGA"], ["mg", "fr"], "east-africa"),
      africaCountry("MW", "Malawi", ["MWK"], ["en", "ny"], "east-africa"),
      africaCountry("MU", "Mauritius", ["MUR"], ["en", "fr"], "east-africa"),
      africaCountry("MZ", "Mozambique", ["MZN"], ["pt"], "east-africa"),
      africaCountry("RW", "Rwanda", ["RWF"], ["rw", "en", "fr", "sw"], "east-africa"),
      africaCountry("SC", "Seychelles", ["SCR"], ["en", "fr"], "east-africa"),
      africaCountry("SO", "Somalia", ["SOS"], ["so", "ar"], "east-africa"),
      africaCountry("SS", "South Sudan", ["SSP"], ["en"], "east-africa"),
      africaCountry("TZ", "Tanzania", ["TZS"], ["sw", "en"], "east-africa"),
      africaCountry("UG", "Uganda", ["UGX"], ["en", "sw"], "east-africa"),

      africaCountry("BW", "Botswana", ["BWP"], ["en"], "southern-africa"),
      africaCountry("SZ", "Eswatini", ["SZL"], ["en"], "southern-africa"),
      africaCountry("LS", "Lesotho", ["LSL"], ["en"], "southern-africa"),
      africaCountry("NA", "Namibia", ["NAD"], ["en"], "southern-africa"),
      africaCountry("ZA", "South Africa", ["ZAR"], ["en"], "southern-africa"),
      africaCountry("ZM", "Zambia", ["ZMW"], ["en"], "southern-africa"),
      africaCountry("ZW", "Zimbabwe", ["ZWG", "USD"], ["en"], "southern-africa"),
    ],
  },
  mena: {
    code: "mena", name: "Middle East", routeSlug: "mena", launchState: PRIVATE, defaultLanguage: "ar",
    languages: ["ar", "en", "fr"], currencies: [], countries: [], privacyFrameworks: ["country-specific-data-protection"],
    taxFrameworks: ["VAT", "custom"], reportingCurrency: "USD", telemetryNamespace: "edunancial.middle-east", independentRuntime: true,
    operatingSegments: [segment("middle-east", "Middle East", "middle-east")],
  },
  "asia-pacific": {
    code: "asia-pacific", name: "Asia", routeSlug: "asia-pacific", launchState: PRIVATE, defaultLanguage: "en",
    languages: ["en", "zh", "ja", "ko", "hi"], currencies: [], countries: [], privacyFrameworks: ["country-specific-data-protection"],
    taxFrameworks: ["VAT", "GST", "custom"], reportingCurrency: "USD", telemetryNamespace: "edunancial.asia", independentRuntime: true,
    operatingSegments: [
      segment("developed-asia", "Developed Asia", "asia"),
      segment("emerging-asia", "Emerging Asia", "asia"),
    ],
  },
  oceania: {
    code: "oceania", name: "Oceania", routeSlug: "oceania", launchState: PRIVATE, defaultLanguage: "en",
    languages: ["en"], currencies: ["AUD", "NZD"], countries: [], privacyFrameworks: ["country-specific-data-protection"],
    taxFrameworks: ["GST"], reportingCurrency: "AUD", telemetryNamespace: "edunancial.oceania", independentRuntime: true,
    operatingSegments: [segment("oceania", "Oceania", "oceania")],
  },
};

export const GLOBAL_REPORTING_CURRENCY = "USD" as const;

export function getRegionArchitecture(code: CanonicalRegionCode): RegionArchitectureConfig {
  return REGION_ARCHITECTURE[code];
}

export function isPublicRegion(code: CanonicalRegionCode): boolean {
  return REGION_ARCHITECTURE[code].launchState === "ACTIVE";
}

export function getCountryArchitecture(countryCode: string): { region: RegionArchitectureConfig; country: CountryArchitectureConfig } | null {
  const normalized = countryCode.trim().toUpperCase();
  for (const region of Object.values(REGION_ARCHITECTURE)) {
    const country = region.countries.find((entry) => entry.countryCode === normalized);
    if (country) return { region, country };
  }
  return null;
}

export function effectiveCountryControls(country: CountryArchitectureConfig): CountryServiceControls {
  const active = country.launchState === "ACTIVE" || country.launchState === "BETA";
  const defaults: CountryServiceControls = active
    ? { publicAccess: true, registrations: true, paidCommerce: true, marketplace: true, marketing: true }
    : privateControls;
  return { ...defaults, ...country.serviceControls };
}

export function isCountryCommerceEnabled(countryCode: string): boolean {
  const architecture = getCountryArchitecture(countryCode);
  if (!architecture) return false;
  const controls = effectiveCountryControls(architecture.country);
  return controls.publicAccess && controls.registrations && controls.paidCommerce;
}

export function getGlobalTelemetryKey(countryCode: string): string | null {
  const architecture = getCountryArchitecture(countryCode);
  if (!architecture) return null;
  return architecture.country.telemetryKey ?? `${architecture.region.telemetryNamespace ?? `edunancial.${architecture.region.code}`}.${countryCode.toLowerCase()}`;
}
