import { LANGUAGE_CATALOG, normalizeLanguageCode } from "@/lib/international/languages";
import { REGION_ARCHITECTURE } from "@/lib/regions/architecture";

export interface LanguageOption {
  code: string;
  name: string;
  enabled: boolean;
}

const activeLanguageCodes = new Set(
  Object.values(REGION_ARCHITECTURE)
    .flatMap((region) =>
      region.countries
        .filter((country) => (country.launchState ?? region.launchState) === "ACTIVE")
        .flatMap((country) => country.languages),
    )
    .map((code) => normalizeLanguageCode(code)),
);

/**
 * Compatibility view for legacy location consumers.
 *
 * The language catalog is authoritative in src/lib/international/languages.ts.
 * Availability is derived from currently ACTIVE country configuration rather
 * than maintained as a second hard-coded language list.
 */
export const languages: LanguageOption[] = LANGUAGE_CATALOG.map((language) => ({
  code: language.code,
  name: language.label,
  enabled: activeLanguageCodes.has(language.code),
}));
