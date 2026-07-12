import type { Pricing } from "@/lib/pricing/types";
import { AFRICA_PRICING } from "@/lib/pricing/africa";
import { ASIA_PRICING } from "@/lib/pricing/asia";
import { CARIBBEAN_PRICING } from "@/lib/pricing/caribbean";
import { EUROPE_PRICING } from "@/lib/pricing/europe";
import { LATAM_PRICING } from "@/lib/pricing/latam";
import { MENA_PRICING } from "@/lib/pricing/mena";
import { OCEANIA_PRICING } from "@/lib/pricing/oceania";
import { US_PRICING } from "@/lib/pricing/us";

export const REGION_SECTION_SLUGS = [
  "legal",
  "privacy",
  "terms",
  "contact",
  "membership",
  "dashboard",
  "assessment",
  "curriculum-upload",
] as const;

export type RegionSectionSlug = (typeof REGION_SECTION_SLUGS)[number];

export type GlobalRegionSlug =
  | "north-america"
  | "europe-2a"
  | "europe-2b"
  | "latin-america-2a"
  | "latin-america-2b"
  | "caribbean"
  | "africa"
  | "middle-east"
  | "asia"
  | "oceania";

export type GlobalRegionArchitecture = {
  slug: GlobalRegionSlug;
  name: string;
  shortName: string;
  defaultLanguage: string;
  supportedLanguages: readonly string[];
  supportedCurrencies: readonly string[];
  locale: string;
  timezone: string;
  securityModel: string;
  pricing: Pricing;
  pricingKey: string;
  analyticsKey: string;
  curriculumUploadPath: string;
  legacyRoute?: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: readonly string[];
  markets: readonly string[];
};

const REGION_ARCHITECTURE: readonly GlobalRegionArchitecture[] = [
  {
    slug: "north-america",
    name: "North America",
    shortName: "NA",
    defaultLanguage: "en",
    supportedLanguages: ["en", "es", "fr"],
    supportedCurrencies: ["USD", "CAD"],
    locale: "en-US",
    timezone: "America/New_York",
    securityModel: "North America shared privacy and payment controls.",
    pricing: US_PRICING,
    pricingKey: "us",
    analyticsKey: "north-america",
    curriculumUploadPath: "curriculum/staging/regions/north-america",
    eyebrow: "Global Region Architecture",
    title: "North America regional architecture is live.",
    description:
      "North America uses the shared Edunancial regional architecture for navigation, pricing, localization, legal routing, assessments, dashboards, and future curriculum intake.",
    highlights: [
      "Membership-first launch flow",
      "Shared legal and privacy routing",
      "Regional pricing in USD and CAD context",
      "Analytics and dashboard architecture enabled",
    ],
    markets: ["United States", "Canada", "North America shared services"],
  },
  {
    slug: "europe-2a",
    name: "Europe 2A",
    shortName: "EU 2A",
    defaultLanguage: "en",
    supportedLanguages: ["en", "fr", "de", "es", "it"],
    supportedCurrencies: ["EUR", "GBP", "CHF"],
    locale: "en-GB",
    timezone: "Europe/Paris",
    securityModel: "Europe regional controls aligned to GDPR-first operations.",
    pricing: EUROPE_PRICING,
    pricingKey: "europe",
    analyticsKey: "europe-2a",
    curriculumUploadPath: "curriculum/staging/regions/europe-2a",
    legacyRoute: "/western-europe",
    eyebrow: "Global Region Architecture",
    title: "Europe 2A now mirrors the shared regional architecture.",
    description:
      "Europe 2A extends the existing Europe architecture with dedicated routing, localization, pricing references, legal entry points, dashboard scaffolding, and assessment placeholders.",
    highlights: [
      "Dedicated Europe 2A route family",
      "Western Europe pricing profile reuse",
      "Shared compliance and privacy routing",
      "Future curriculum intake path reserved",
    ],
    markets: ["Western Europe", "United Kingdom", "EU compliance markets"],
  },
  {
    slug: "europe-2b",
    name: "Europe 2B",
    shortName: "EU 2B",
    defaultLanguage: "en",
    supportedLanguages: ["en", "fr", "de", "es", "it"],
    supportedCurrencies: ["EUR", "PLN", "CZK", "HUF"],
    locale: "en-GB",
    timezone: "Europe/Warsaw",
    securityModel: "Europe regional controls aligned to GDPR-first operations.",
    pricing: EUROPE_PRICING,
    pricingKey: "europe",
    analyticsKey: "europe-2b",
    curriculumUploadPath: "curriculum/staging/regions/europe-2b",
    legacyRoute: "/eastern-europe",
    eyebrow: "Global Region Architecture",
    title: "Europe 2B now mirrors the shared regional architecture.",
    description:
      "Europe 2B adds the same architecture contract as Europe 2A while keeping pricing, legal, localization, and dashboard behavior aligned with existing Europe standards.",
    highlights: [
      "Dedicated Europe 2B route family",
      "Eastern Europe launch alignment",
      "Shared legal, privacy, and terms routing",
      "Assessment and dashboard placeholders ready",
    ],
    markets: ["Eastern Europe", "Central Europe", "Regional expansion pilots"],
  },
  {
    slug: "latin-america-2a",
    name: "Latin America 2A",
    shortName: "LATAM 2A",
    defaultLanguage: "es",
    supportedLanguages: ["es", "pt", "en"],
    supportedCurrencies: ["USD", "MXN", "COP", "PEN"],
    locale: "es-419",
    timezone: "America/Mexico_City",
    securityModel:
      "Latin America shared routing with localized pricing and operational controls.",
    pricing: LATAM_PRICING,
    pricingKey: "latam",
    analyticsKey: "latin-america-2a",
    curriculumUploadPath: "curriculum/staging/regions/latin-america-2a",
    legacyRoute: "/latin-america",
    eyebrow: "Global Region Architecture",
    title: "Latin America 2A is now wired into the shared architecture.",
    description:
      "Latin America 2A introduces dedicated architecture-only routing while preserving the existing Latin America experience and pricing model.",
    highlights: [
      "Dedicated LATAM 2A route family",
      "Spanish and Portuguese localization coverage",
      "Shared membership, dashboard, and legal scaffolding",
      "Future curriculum upload path reserved",
    ],
    markets: ["Mexico", "Central America", "Northern South America"],
  },
  {
    slug: "latin-america-2b",
    name: "Latin America 2B",
    shortName: "LATAM 2B",
    defaultLanguage: "pt",
    supportedLanguages: ["pt", "es", "en"],
    supportedCurrencies: ["USD", "BRL", "ARS", "CLP"],
    locale: "pt-BR",
    timezone: "America/Sao_Paulo",
    securityModel:
      "Latin America shared routing with localized pricing and operational controls.",
    pricing: LATAM_PRICING,
    pricingKey: "latam",
    analyticsKey: "latin-america-2b",
    curriculumUploadPath: "curriculum/staging/regions/latin-america-2b",
    eyebrow: "Global Region Architecture",
    title: "Latin America 2B is now wired into the shared architecture.",
    description:
      "Latin America 2B provides dedicated architecture placeholders for routing, pricing references, localization, analytics, and future curriculum intake.",
    highlights: [
      "Dedicated LATAM 2B route family",
      "Brazil and Southern Cone launch support",
      "Shared privacy, terms, and contact routing",
      "Assessment placeholder and dashboard route ready",
    ],
    markets: ["Brazil", "Argentina", "Southern South America"],
  },
  {
    slug: "caribbean",
    name: "Caribbean",
    shortName: "Caribbean",
    defaultLanguage: "es",
    supportedLanguages: ["es", "en", "fr", "nl", "ht"],
    supportedCurrencies: ["USD", "DOP", "JMD", "TTD", "BBD", "HTG", "AWG"],
    locale: "en-029",
    timezone: "America/Santo_Domingo",
    securityModel: "Caribbean routing follows the shared Edunancial privacy model.",
    pricing: CARIBBEAN_PRICING,
    pricingKey: "caribbean",
    analyticsKey: "caribbean",
    curriculumUploadPath: "curriculum/staging/regions/caribbean",
    eyebrow: "Global Region Architecture",
    title: "Caribbean regional architecture remains aligned.",
    description:
      "Caribbean keeps the existing route while now sharing the same architecture surface area as the other required global regions.",
    highlights: [
      "Shared legal and dashboard routing",
      "Localized language and currency coverage",
      "Dedicated curriculum intake path reserved",
      "Assessment and analytics hooks enabled",
    ],
    markets: ["Dominican Republic", "Jamaica", "Haiti", "Trinidad & Tobago", "Caribbean growth markets"],
  },
  {
    slug: "africa",
    name: "Africa",
    shortName: "Africa",
    defaultLanguage: "en",
    supportedLanguages: ["en", "fr", "sw", "ar"],
    supportedCurrencies: ["USD", "NGN", "KES", "ZAR", "EGP"],
    locale: "en-ZA",
    timezone: "Africa/Johannesburg",
    securityModel:
      "Africa routing uses the shared Edunancial legal and security controls.",
    pricing: AFRICA_PRICING,
    pricingKey: "africa",
    analyticsKey: "africa",
    curriculumUploadPath: "curriculum/staging/regions/africa",
    eyebrow: "Global Region Architecture",
    title: "Africa now has a dedicated shared-architecture entry point.",
    description:
      "Africa now has a single architecture route that complements the existing East, West, and Southern Africa pages without changing them.",
    highlights: [
      "Dedicated Africa route family",
      "Shared pricing and dashboard architecture",
      "Legal, contact, and assessment routing ready",
      "Future curriculum intake path reserved",
    ],
    markets: ["East Africa", "West Africa", "Southern Africa"],
  },
  {
    slug: "middle-east",
    name: "Middle East",
    shortName: "Middle East",
    defaultLanguage: "ar",
    supportedLanguages: ["ar", "en", "fr"],
    supportedCurrencies: ["USD", "AED", "SAR", "QAR"],
    locale: "ar-SA",
    timezone: "Asia/Riyadh",
    securityModel:
      "Middle East routing follows shared privacy, legal, and operational controls.",
    pricing: MENA_PRICING,
    pricingKey: "mena",
    analyticsKey: "middle-east",
    curriculumUploadPath: "curriculum/staging/regions/middle-east",
    eyebrow: "Global Region Architecture",
    title: "Middle East remains connected to the shared architecture.",
    description:
      "Middle East now has dedicated legal, dashboard, assessment, and curriculum routing that reuses the repository's existing regional standards.",
    highlights: [
      "Dedicated route family around the existing page",
      "Arabic-first localization configuration",
      "Shared legal and privacy scaffolding",
      "Assessment placeholder and analytics hook enabled",
    ],
    markets: ["Gulf Cooperation Council", "Levant", "Middle East expansion hubs"],
  },
  {
    slug: "asia",
    name: "Asia",
    shortName: "Asia",
    defaultLanguage: "en",
    supportedLanguages: ["en", "zh", "ja", "ko", "hi"],
    supportedCurrencies: ["USD", "JPY", "SGD", "KRW", "INR"],
    locale: "en-SG",
    timezone: "Asia/Singapore",
    securityModel: "Asia routing follows the shared Edunancial security baseline.",
    pricing: ASIA_PRICING,
    pricingKey: "asia",
    analyticsKey: "asia",
    curriculumUploadPath: "curriculum/staging/regions/asia",
    legacyRoute: "/asia-pacific",
    eyebrow: "Global Region Architecture",
    title: "Asia now has a dedicated shared-architecture route family.",
    description:
      "Asia receives dedicated architecture routing while preserving the existing Asia-Pacific implementation and reusing the same pricing and localization standards.",
    highlights: [
      "Dedicated Asia route family",
      "Shared localization across key Asian languages",
      "Pricing, dashboard, and legal placeholders aligned",
      "Future curriculum intake path reserved",
    ],
    markets: ["Asia-Pacific", "East Asia", "South Asia"],
  },
  {
    slug: "oceania",
    name: "Oceania",
    shortName: "Oceania",
    defaultLanguage: "en",
    supportedLanguages: ["en"],
    supportedCurrencies: ["AUD", "NZD"],
    locale: "en-AU",
    timezone: "Australia/Sydney",
    securityModel:
      "Oceania routing follows the shared Edunancial legal and privacy baseline.",
    pricing: OCEANIA_PRICING,
    pricingKey: "oceania",
    analyticsKey: "oceania",
    curriculumUploadPath: "curriculum/staging/regions/oceania",
    eyebrow: "Global Region Architecture",
    title: "Oceania now has the same architecture surface area as every other region.",
    description:
      "Oceania had pricing support but no public architecture route. This adds the missing route, localization, legal routing, dashboard scaffolding, analytics hook, and curriculum intake path.",
    highlights: [
      "Dedicated Oceania route family",
      "AUD and NZD currency configuration",
      "Assessment and dashboard placeholders ready",
      "Future curriculum upload path reserved",
    ],
    markets: ["Australia", "New Zealand", "Pacific region expansion"],
  },
] as const;

export const REQUIRED_GLOBAL_REGIONS = REGION_ARCHITECTURE;

export function getGlobalRegionArchitecture(
  slug: string
): GlobalRegionArchitecture | undefined {
  return REGION_ARCHITECTURE.find((region) => region.slug === slug);
}

export function getRegionSectionPath(
  region: GlobalRegionSlug,
  section: RegionSectionSlug
): string {
  return `/${region}/${section}`;
}
