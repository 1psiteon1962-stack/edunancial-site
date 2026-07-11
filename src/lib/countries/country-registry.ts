import { CountryConfiguration } from "@/types/country-config";
import {
  APAC_FOUNDATION_COUNTRIES,
  isApacAudienceEnabled,
} from "@/lib/regionalization/apacFoundation";

const apacCountries: CountryConfiguration[] = APAC_FOUNDATION_COUNTRIES.map(
  (country) => ({
    isoCode: country.isoCode,
    country: country.country,
    continent: country.continent,
    enabled: isApacAudienceEnabled(country.id, "public"),
    status: country.status,
    membershipEnabled: isApacAudienceEnabled(country.id, "public"),
    marketplaceEnabled:
      country.capabilities.marketplace && isApacAudienceEnabled(country.id, "public"),
    paymentsEnabled:
      country.capabilities.payments && isApacAudienceEnabled(country.id, "public"),
    coursesEnabled:
      country.capabilities.courses && isApacAudienceEnabled(country.id, "public"),
    assessmentsEnabled:
      country.capabilities.assessments && isApacAudienceEnabled(country.id, "public"),
    hiringEnabled:
      country.capabilities.hiring && isApacAudienceEnabled(country.id, "public"),
    aiEnabled: country.capabilities.ai && isApacAudienceEnabled(country.id, "public"),
    operatingEntity: country.operatingEntity,
    currency: country.currency.code,
    language: country.languages[0]?.label ?? "English",
    region: "Asia Pacific",
    locales: country.languages.map((language) => language.locale),
    founderControlsEnabled: country.capabilities.founderControls,
    betaTesterControlsEnabled: country.capabilities.betaTesterControls,
    launchControls: country.launchControls,
    taxConfiguration: country.tax,
    complianceConfiguration: country.compliance,
    seoLocale: country.seo.locale,
  }),
);

export const countries: CountryConfiguration[] = [

  {
    isoCode: "US",
    country: "United States",
    continent: "North America",
    enabled: true,
    status: "live",
    membershipEnabled: true,
    marketplaceEnabled: true,
    paymentsEnabled: true,
    coursesEnabled: true,
    assessmentsEnabled: true,
    hiringEnabled: true,
    aiEnabled: true,
    operatingEntity: "Edge Financial USA",
    currency: "USD",
    language: "English",
  },

  {
    isoCode: "CA",
    country: "Canada",
    continent: "North America",
    enabled: true,
    status: "development",
    membershipEnabled: true,
    marketplaceEnabled: true,
    paymentsEnabled: true,
    coursesEnabled: true,
    assessmentsEnabled: true,
    hiringEnabled: true,
    aiEnabled: true,
    operatingEntity: "Edge Financial USA",
    currency: "CAD",
    language: "English",
  },

  {
    isoCode: "UG",
    country: "Uganda",
    continent: "Africa",
    enabled: true,
    status: "planning",
    membershipEnabled: true,
    marketplaceEnabled: true,
    paymentsEnabled: false,
    coursesEnabled: true,
    assessmentsEnabled: true,
    hiringEnabled: true,
    aiEnabled: true,
    operatingEntity: "Edge Financial USA",
    currency: "UGX",
    language: "English",
  },

  {
    isoCode: "CU",
    country: "Cuba",
    continent: "Caribbean",
    enabled: false,
    status: "disabled",
    membershipEnabled: false,
    marketplaceEnabled: false,
    paymentsEnabled: false,
    coursesEnabled: false,
    assessmentsEnabled: false,
    hiringEnabled: false,
    aiEnabled: false,
    operatingEntity: "",
    currency: "CUP",
    language: "Spanish",
  },

  ...apacCountries,

];
