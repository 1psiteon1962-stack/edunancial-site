import {
  APAC_FOUNDATION_COUNTRIES,
  isApacAudienceEnabled,
  type LaunchControls,
} from "@/lib/regionalization/apacFoundation";

export type LaunchStatus = "live" | "coming-soon" | "planned";

export interface CountryConfig {
  id: string;
  name: string;
  iso2: string;
  currency: string;
  currencySymbol: string;
  language: string;
  timezone: string;

  launchStatus: LaunchStatus;

  region?: string;

  locales?: string[];

  launchControls?: LaunchControls;

  marketplaceEnabled: boolean;
  assessmentEnabled: boolean;
  passportEnabled: boolean;
  coursesEnabled: boolean;
}

const apacCountries: CountryConfig[] = APAC_FOUNDATION_COUNTRIES.map((country) => ({
  id: country.id,
  name: country.country,
  iso2: country.isoCode,
  currency: country.currency.code,
  currencySymbol: country.currency.symbol,
  language: country.languages[0]?.label ?? "English",
  timezone: country.timezone,
  launchStatus: country.status === "beta" ? "coming-soon" : "planned",
  region: "asia-pacific",
  locales: country.languages.map((language) => language.locale),
  launchControls: country.launchControls,
  marketplaceEnabled:
    country.capabilities.marketplace && isApacAudienceEnabled(country.id, "public"),
  assessmentEnabled:
    country.capabilities.assessments && isApacAudienceEnabled(country.id, "public"),
  passportEnabled: isApacAudienceEnabled(country.id, "public"),
  coursesEnabled:
    country.capabilities.courses && isApacAudienceEnabled(country.id, "public"),
}));

export const countries: CountryConfig[] = [

  {
    id: "us",
    name: "United States",
    iso2: "US",
    currency: "USD",
    currencySymbol: "$",
    language: "English",
    timezone: "America/New_York",

    launchStatus: "live",

    marketplaceEnabled: true,
    assessmentEnabled: true,
    passportEnabled: true,
    coursesEnabled: true,
  },

  {
    id: "ca",
    name: "Canada",
    iso2: "CA",
    currency: "CAD",
    currencySymbol: "$",
    language: "English",
    timezone: "America/Toronto",

    launchStatus: "planned",

    marketplaceEnabled: false,
    assessmentEnabled: false,
    passportEnabled: false,
    coursesEnabled: false,
  },

  {
    id: "ug",
    name: "Uganda",
    iso2: "UG",
    currency: "UGX",
    currencySymbol: "USh",
    language: "English",
    timezone: "Africa/Kampala",

    launchStatus: "planned",

    marketplaceEnabled: false,
    assessmentEnabled: false,
    passportEnabled: false,
    coursesEnabled: false,
  },

  {
    id: "ng",
    name: "Nigeria",
    iso2: "NG",
    currency: "NGN",
    currencySymbol: "₦",
    language: "English",
    timezone: "Africa/Lagos",

    launchStatus: "planned",

    marketplaceEnabled: false,
    assessmentEnabled: false,
    passportEnabled: false,
    coursesEnabled: false,
  },

  {
    id: "za",
    name: "South Africa",
    iso2: "ZA",
    currency: "ZAR",
    currencySymbol: "R",
    language: "English",
    timezone: "Africa/Johannesburg",

    launchStatus: "planned",

    marketplaceEnabled: false,
    assessmentEnabled: false,
    passportEnabled: false,
    coursesEnabled: false,
  },

  {
    id: "eg",
    name: "Egypt",
    iso2: "EG",
    currency: "EGP",
    currencySymbol: "E£",
    language: "Arabic",
    timezone: "Africa/Cairo",

    launchStatus: "planned",

    marketplaceEnabled: false,
    assessmentEnabled: false,
    passportEnabled: false,
    coursesEnabled: false,
  },

  {
    id: "dz",
    name: "Algeria",
    iso2: "DZ",
    currency: "DZD",
    currencySymbol: "DA",
    language: "Arabic",
    timezone: "Africa/Algiers",

    launchStatus: "planned",

    marketplaceEnabled: false,
    assessmentEnabled: false,
    passportEnabled: false,
    coursesEnabled: false,
  },

  {
    id: "ma",
    name: "Morocco",
    iso2: "MA",
    currency: "MAD",
    currencySymbol: "DH",
    language: "Arabic",
    timezone: "Africa/Casablanca",

    launchStatus: "planned",

    marketplaceEnabled: false,
    assessmentEnabled: false,
    passportEnabled: false,
    coursesEnabled: false,
  },

  ...apacCountries,

];
