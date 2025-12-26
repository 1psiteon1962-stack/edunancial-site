// lib/core.ts

export type Region = "US" | "LATAM" | "AFRICA" | "EU" | "MENA";

export type Language = "en" | "es" | "fr" | "ar";

export type Module = {
  id: number;
  title: string;
  description: string;
};

export type DisciplineEntry = {
  date: string; // ISO
  unit: string; // "silver-g", "gold-g", "cash"
  amount: number;
};

export const REGION_DEFAULT_LANGUAGE: Record<Region, Language> = {
  US: "en",
  LATAM: "es",
  AFRICA: "en",
  EU: "en",
  MENA: "ar",
};
