// lib/content.ts

import { Region, Language } from "./core";

type Copy = {
  title: string;
  body: string;
};

const COPY: Partial<Record<Region, Partial<Record<Language, Copy>>>> = {
  AFRICA: {
    en: {
      title: "Income Before Theory",
      body: "We focus on income systems first, discipline second, assets later.",
    },
  },
  LATAM: {
    es: {
      title: "Protección Antes de Crecimiento",
      body: "Primero proteger, luego crecer con disciplina.",
    },
    en: {
      title: "Protection Before Growth",
      body: "Stability comes before scale.",
    },
  },
};

export function resolveCopy(
  region: Region,
  lang: Language
): Copy | null {
  return COPY[region]?.[lang] ?? null;
}
