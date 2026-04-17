// lib/core.ts

// 🌍 REGIONS
export type Region =
  | "us"
  | "latam"
  | "caribbean"
  | "africa"
  | "europe"
  | "asia";

// 🌐 LANGUAGES
export type Language =
  | "en"
  | "es"
  | "fr"
  | "pt"
  | "ar";

// ✅ DEFAULTS (FULLY ALIGNED WITH ALL IMPORTS)
export const DEFAULT = {
  region: "us" as Region,
  language: "en" as Language,
};

// ✅ REQUIRED BY content-resolver.ts (THIS WAS MISSING)
export const DEFAULT_LANGUAGE: Language = "en";

// (KEEP FOR SAFETY — OTHER FILES MAY USE IT)
export const DEFAULT_REGION: Region = "us";
