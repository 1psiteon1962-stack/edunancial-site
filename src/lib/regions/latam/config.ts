/**
 * LATAM Region Configuration
 *
 * Implements the global RegionalFrameworkConfig interface.
 * LATAM is PRIVATE by default — it will not be publicly accessible
 * or indexed until the regionStatus is explicitly changed to "ACTIVE".
 *
 * To activate:
 *   1. Change regionStatus to "ACTIVE" (whole region)
 *   2. Or set individual country overrides in launchControl.countryOverrides
 */

import type { RegionalFrameworkConfig } from "@/lib/global/regional-framework";
import { getCurrency } from "@/lib/global/currency-framework";
import { ALL_LATAM_COUNTRIES } from "./countries";
import { LATAM_LANGUAGE_CODES, LATAM_DEFAULT_LANGUAGE } from "./languages";
import { LATAM_CURRENCY_CODES, LATAM_DEFAULT_CURRENCY } from "./currencies";

const defaultCurrency = getCurrency(LATAM_DEFAULT_CURRENCY);
if (!defaultCurrency) {
  throw new Error(`[LATAM] Default currency "${LATAM_DEFAULT_CURRENCY}" not found in global registry.`);
}

/**
 * LATAM Regional Framework Configuration
 *
 * ⚠️  regionStatus: "PRIVATE"
 * LATAM is intentionally private. Do NOT change this without a formal
 * regional launch approval. Use country-level overrides for soft launches.
 */
export const LATAM_REGION_CONFIG: RegionalFrameworkConfig = {
  slug: "latam",
  name: "Latin America",
  routePrefix: "/latam",

  launchControl: {
    regionStatus: "PRIVATE", // ← LATAM default: PRIVATE until formally activated
    countryOverrides: {
      // Individual country overrides go here.
      // Example (do not uncomment without approval):
      // "mx": "ACTIVE",
      // "br": "ACTIVE",
    },
  },

  defaultCurrency,
  currencies: LATAM_CURRENCY_CODES,
  defaultLanguage: LATAM_DEFAULT_LANGUAGE,
  languages: LATAM_LANGUAGE_CODES,
  countries: ALL_LATAM_COUNTRIES,

  complianceNotes:
    "Data protection varies by country. Brazil: LGPD. Mexico: LFPDPPP. " +
    "Argentina: PDPA. Colombia: Ley 1581. Always verify local requirements before activation.",
};
