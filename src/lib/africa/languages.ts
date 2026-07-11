// ======================================================
// AFRICA REGIONAL FOUNDATION
// languages.ts – Language framework
// Supports English, French, Arabic, Portuguese, and
// extensible regional language codes.
// ======================================================

export type AfricaCoreLanguageCode = "en" | "fr" | "ar" | "pt";

/** Regional / indigenous language codes used across Africa. */
export type AfricaRegionalLanguageCode =
  | "sw"   // Swahili
  | "ha"   // Hausa
  | "yo"   // Yoruba
  | "ig"   // Igbo
  | "am"   // Amharic
  | "so"   // Somali
  | "rw"   // Kinyarwanda
  | "ti"   // Tigrinya
  | "rn"   // Kirundi
  | "mg"   // Malagasy
  | "ny"   // Chichewa (Nyanja)
  | "sn"   // Shona
  | "nd"   // Ndebele
  | "zu"   // Zulu
  | "xh"   // Xhosa
  | "af"   // Afrikaans
  | "st"   // Sesotho
  | "tn"   // Setswana
  | "ts"   // Tsonga
  | "ss"   // Siswati
  | "ve"   // Tshivenda
  | "nr"   // Ndebele (South Africa)
  | "nso"  // Sepedi / Northern Sotho
  | "sg"   // Sango
  | "crs"  // Seychellois Creole
  | string; // extensible – add new codes without schema change

export type AfricaLanguageCode = AfricaCoreLanguageCode | AfricaRegionalLanguageCode;

export interface AfricaLanguage {
  code: AfricaLanguageCode;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  /** ISO 639-1 or 639-3 code for locale construction */
  iso639: string;
  core: boolean;
}

export const AFRICA_LANGUAGES: AfricaLanguage[] = [
  // ── Core languages ───────────────────────────────────
  { code: "en", name: "English",    nativeName: "English",    direction: "ltr", iso639: "en", core: true },
  { code: "fr", name: "French",     nativeName: "Français",   direction: "ltr", iso639: "fr", core: true },
  { code: "ar", name: "Arabic",     nativeName: "العربية",    direction: "rtl", iso639: "ar", core: true },
  { code: "pt", name: "Portuguese", nativeName: "Português",  direction: "ltr", iso639: "pt", core: true },

  // ── Regional languages ───────────────────────────────
  { code: "sw",  name: "Swahili",      nativeName: "Kiswahili",   direction: "ltr", iso639: "sw",  core: false },
  { code: "ha",  name: "Hausa",        nativeName: "Hausa",       direction: "ltr", iso639: "ha",  core: false },
  { code: "yo",  name: "Yoruba",       nativeName: "Yorùbá",      direction: "ltr", iso639: "yo",  core: false },
  { code: "ig",  name: "Igbo",         nativeName: "Igbo",        direction: "ltr", iso639: "ig",  core: false },
  { code: "am",  name: "Amharic",      nativeName: "አማርኛ",       direction: "ltr", iso639: "am",  core: false },
  { code: "so",  name: "Somali",       nativeName: "Soomaali",    direction: "ltr", iso639: "so",  core: false },
  { code: "rw",  name: "Kinyarwanda",  nativeName: "Ikinyarwanda",direction: "ltr", iso639: "rw",  core: false },
  { code: "ti",  name: "Tigrinya",     nativeName: "ትግርኛ",       direction: "ltr", iso639: "ti",  core: false },
  { code: "rn",  name: "Kirundi",      nativeName: "Ikirundi",    direction: "ltr", iso639: "rn",  core: false },
  { code: "mg",  name: "Malagasy",     nativeName: "Malagasy",    direction: "ltr", iso639: "mg",  core: false },
  { code: "ny",  name: "Chichewa",     nativeName: "Chichewa",    direction: "ltr", iso639: "ny",  core: false },
  { code: "sn",  name: "Shona",        nativeName: "chiShona",    direction: "ltr", iso639: "sn",  core: false },
  { code: "zu",  name: "Zulu",         nativeName: "isiZulu",     direction: "ltr", iso639: "zu",  core: false },
  { code: "xh",  name: "Xhosa",        nativeName: "isiXhosa",    direction: "ltr", iso639: "xh",  core: false },
  { code: "af",  name: "Afrikaans",    nativeName: "Afrikaans",   direction: "ltr", iso639: "af",  core: false },
  { code: "st",  name: "Sesotho",      nativeName: "Sesotho",     direction: "ltr", iso639: "st",  core: false },
];

/** Returns the language definition for a given code, or undefined. */
export function getAfricaLanguage(
  code: AfricaLanguageCode
): AfricaLanguage | undefined {
  return AFRICA_LANGUAGES.find((l) => l.code === code);
}

/** Returns all core (EN/FR/AR/PT) language definitions. */
export function getAfricaCoreLanguages(): AfricaLanguage[] {
  return AFRICA_LANGUAGES.filter((l) => l.core);
}
