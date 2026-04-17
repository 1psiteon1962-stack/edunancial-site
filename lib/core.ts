// lib/core.ts

// 🌍 REGIONS
export type Region =
  | "us"
  | "latam"
  | "caribbean"
  | "africa"
  | "europe"
  | "asia";

// 🌐 LANGUAGES (THIS WAS MISSING)
export type Language =
  | "en"
  | "es"
  | "fr"
  | "pt"
  | "ar";

// ✅ DEFAULTS (MATCH WHAT OTHER FILES EXPECT)
export const DEFAULT = {
  region: "us" as Region,
  language: "en" as Language,
};

// (OPTIONAL BUT SAFE — keeps backward compatibility)
export const DEFAULT_REGION: Region = "us";
