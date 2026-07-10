/**
 * LATAM Language Configuration
 *
 * Languages supported across Latin America and the Caribbean.
 * Additional languages can be added here without code changes elsewhere.
 */

import type { LanguageConfig } from "@/lib/global/regional-framework";

export const LATAM_LANGUAGES: LanguageConfig[] = [
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr",
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    direction: "ltr",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    direction: "ltr",
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    direction: "ltr",
  },
];

export const LATAM_LANGUAGE_CODES = LATAM_LANGUAGES.map((l) => l.code);

export const LATAM_DEFAULT_LANGUAGE = "es";
