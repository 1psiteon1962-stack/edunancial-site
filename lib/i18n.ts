// lib/i18n.ts

export type Region = "US" | "LATAM" | "AFRICA";
export type Language = "en" | "es" | "fr" | "ar";

export type CopyBlock = {
  title: string;
  subtitle: string;
  body: string;
  dir: "ltr" | "rtl";
};

/* --------------------------------------------------
   LANGUAGE SUPPORT BY REGION
-------------------------------------------------- */

export const REGION_LANGUAGES: Record<Region, Language[]> = {
  US: ["en"],
  LATAM: ["es", "en"],
  AFRICA: ["en", "fr", "ar"],
};

export const DEFAULT_LANGUAGE: Record<Region, Language> = {
  US: "en",
  LATAM: "es",
  AFRICA: "en",
};

/* --------------------------------------------------
   COPY DATABASE
-------------------------------------------------- */

const COPY: Record<Region, Partial<Record<Language, CopyBlock>>> = {
  US: {
    en: {
      title: "Edunancial — United States",
      subtitle: "Capital literacy for a complex economy",
      body:
        "We help individuals understand systems of capital, ownership, and risk so they can operate effectively in modern markets.",
      dir: "ltr",
    },
  },

  LATAM: {
    es: {
      title: "Edunancial — América Latina",
      subtitle: "Capital, estructura y oportunidades reales",
      body:
        "Apoyamos a emprendedores y operadores en mercados emergentes con claridad estructural, no promesas vacías.",
      dir: "ltr",
    },
    en: {
      title: "Edunancial — Latin America",
      subtitle: "Capital access without distortion",
      body:
        "We focus on clarity, structure, and long-term capital thinking in rapidly evolving economies.",
      dir: "ltr",
    },
  },

  AFRICA: {
    en: {
      title: "Edunancial — Africa",
      subtitle: "Capital clarity across diverse markets",
      body:
        "Africa is not one economy. We address regional realities with disciplined capital frameworks and practical execution.",
      dir: "ltr",
    },
    fr: {
      title: "Edunancial — Afrique",
      subtitle: "Clarté du capital dans des marchés divers",
      body:
        "L’Afrique n’est pas une seule économie. Nous abordons les réalités régionales avec discipline et structure.",
      dir: "ltr",
    },
    ar: {
      title: "Edunancial — أفريقيا",
      subtitle: "وضوح رأس المال في أسواق متعددة",
      body:
        "أفريقيا ليست اقتصادًا واحدًا. نحن نقدم أطرًا واضحة لرأس المال مع احترام الواقع المحلي.",
      dir: "rtl",
    },
  },
};

/* --------------------------------------------------
   RESOLVER (STATIC SAFE)
-------------------------------------------------- */

export function resolveCopy(
  region: Region,
  language: Language
): CopyBlock | null {
  return COPY[region]?.[language] ?? null;
}
