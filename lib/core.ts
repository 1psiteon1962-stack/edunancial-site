// lib/core.ts

export type Region = "US" | "EU" | "AFRICA" | "LATAM";

export type Language =
  | "en"
  | "es"
  | "pt"
  | "ar"; // ← REQUIRED (this fixes the build)

export type CopyBlock = {
  title: string;
  body: string;
};

type CopyMap = Record<Region, Partial<Record<Language, CopyBlock>>>;

export const COPY: CopyMap = {
  US: {
    en: { title: "Welcome", body: "US English copy" },
    es: { title: "Bienvenido", body: "US Spanish copy" },
  },
  EU: {
    en: { title: "Welcome", body: "EU English copy" },
  },
  AFRICA: {
    en: { title: "Welcome", body: "Africa English copy" },
    ar: { title: "مرحبا", body: "نسخة عربية" },
  },
  LATAM: {
    es: { title: "Bienvenido", body: "LATAM Spanish copy" },
    pt: { title: "Bem-vindo", body: "LATAM Portuguese copy" },
    ar: { title: "مرحبا", body: "نسخة عربية" },
  },
};

export function resolveCopy(
  region: Region,
  lang: Language
): CopyBlock | null {
  return COPY[region]?.[lang] ?? null;
}
