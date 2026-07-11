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

  marketplaceEnabled: boolean;
  assessmentEnabled: boolean;
  passportEnabled: boolean;
  coursesEnabled: boolean;
}

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

  {
    id: "au",
    name: "Australia",
    iso2: "AU",
    currency: "AUD",
    currencySymbol: "$",
    language: "English",
    timezone: "Australia/Sydney",

    launchStatus: "planned",

    marketplaceEnabled: false,
    assessmentEnabled: false,
    passportEnabled: false,
    coursesEnabled: false,
  },

  {
    id: "sg",
    name: "Singapore",
    iso2: "SG",
    currency: "SGD",
    currencySymbol: "S$",
    language: "English",
    timezone: "Asia/Singapore",

    launchStatus: "planned",

    marketplaceEnabled: false,
    assessmentEnabled: false,
    passportEnabled: false,
    coursesEnabled: false,
  },

  {
    id: "jp",
    name: "Japan",
    iso2: "JP",
    currency: "JPY",
    currencySymbol: "¥",
    language: "Japanese",
    timezone: "Asia/Tokyo",

    launchStatus: "planned",

    marketplaceEnabled: false,
    assessmentEnabled: false,
    passportEnabled: false,
    coursesEnabled: false,
  },

  {
    id: "kr",
    name: "South Korea",
    iso2: "KR",
    currency: "KRW",
    currencySymbol: "₩",
    language: "Korean",
    timezone: "Asia/Seoul",

    launchStatus: "planned",

    marketplaceEnabled: false,
    assessmentEnabled: false,
    passportEnabled: false,
    coursesEnabled: false,
  },

  {
    id: "in",
    name: "India",
    iso2: "IN",
    currency: "INR",
    currencySymbol: "₹",
    language: "Hindi",
    timezone: "Asia/Kolkata",

    launchStatus: "planned",

    marketplaceEnabled: false,
    assessmentEnabled: false,
    passportEnabled: false,
    coursesEnabled: false,
  },

];
