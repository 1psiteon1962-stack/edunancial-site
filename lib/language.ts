// lib/language.ts

export type Region =
  | "us"
  | "africa"
  | "latam"
  | "europe"
  | "global";

export type Language = {
  code: string;
  label: string;
};

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, string> = {
  us: "en",
  africa: "en",
  latam: "es",
  europe: "en",
  global: "en",
};
