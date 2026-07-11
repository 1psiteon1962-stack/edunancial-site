// ======================================================
// AFRICA REGIONAL FOUNDATION
// routing.ts – Regional routing configuration
// Maps country ISO codes and sub-regions to URL slugs
// and locale prefixes.
// ======================================================

import { AFRICA_COUNTRIES, AfricaSubRegion } from "./countries";

export interface AfricaRoute {
  /** URL path segment, e.g. "ng" → /africa/ng */
  slug: string;
  /** Country ISO-2 code */
  isoCode: string;
  /** Locale used for i18n routing (e.g. "en-NG") */
  locale: string;
  /** Canonical URL base */
  canonicalBase: string;
}

export interface AfricaSubRegionRoute {
  subRegion: AfricaSubRegion;
  /** URL path segment, e.g. "western-africa" */
  slug: string;
  /** Default locale for this sub-region */
  defaultLocale: string;
}

const CANONICAL_BASE = "https://www.edunancial.com/africa";

/** Sub-region route definitions. */
export const AFRICA_SUBREGION_ROUTES: AfricaSubRegionRoute[] = [
  { subRegion: "northern-africa", slug: "northern-africa", defaultLocale: "ar" },
  { subRegion: "eastern-africa",  slug: "eastern-africa",  defaultLocale: "en" },
  { subRegion: "western-africa",  slug: "western-africa",  defaultLocale: "fr" },
  { subRegion: "central-africa",  slug: "central-africa",  defaultLocale: "fr" },
  { subRegion: "southern-africa", slug: "southern-africa", defaultLocale: "en" },
];

/**
 * Build per-country routes from the country registry.
 * All routes are disabled while AFRICA_REGION_ENABLED = false.
 */
export const AFRICA_COUNTRY_ROUTES: AfricaRoute[] = AFRICA_COUNTRIES.map(
  (country) => ({
    slug: country.isoCode.toLowerCase(),
    isoCode: country.isoCode,
    locale: `${country.officialLanguages[0]}-${country.isoCode}`,
    canonicalBase: `${CANONICAL_BASE}/${country.isoCode.toLowerCase()}`,
  })
);

/** Resolve the route config for a given ISO code. */
export function getAfricaRoute(isoCode: string): AfricaRoute | undefined {
  return AFRICA_COUNTRY_ROUTES.find(
    (r) => r.isoCode.toLowerCase() === isoCode.toLowerCase()
  );
}

/** Resolve the sub-region route for a given sub-region identifier. */
export function getAfricaSubRegionRoute(
  subRegion: AfricaSubRegion
): AfricaSubRegionRoute | undefined {
  return AFRICA_SUBREGION_ROUTES.find((r) => r.subRegion === subRegion);
}
