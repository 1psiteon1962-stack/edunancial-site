// lib/i18n.ts

export type Language = "en" | "es" | "fr" | "ar";

export type Region =
  | "US"
  | "LATAM"
  | "AFRICA"
  | "EU"
  | "MENA";

export const REGION_LANGUAGES: Record<Region, Language[]> = {
  US: ["en"],
  LATAM: ["es", "en"],
  AFRICA: ["en", "fr"],
  EU: ["en", "fr"],
  MENA: ["ar", "en"],
};

type Copy = {
  title: string;
  subtitle: string;
  body: string;
  dir: "ltr" | "rtl";
};

const COPY: Record<Region, Record<Language, Copy>> = {
  US: {
    en: {
      title: "Edunancial",
      subtitle: "Capital literacy for real-world economies",
      body:
        "We focus on structure, capital access, and execution — not theory.",
      dir: "ltr",
    },
  },

  LATAM: {
    es: {
      title: "Edunancial",
      subtitle: "Estructura, capital y ejecución",
      body:
        "Acceso al capital, sistemas reales y pensamiento estratégico.",
      dir: "ltr",
    },
    en: {
      title: "Edunancial",
      subtitle: "Capital literacy for emerging markets",
      body:
        "Cross-border structure and disciplined execution.",
      dir: "ltr",
    },
  },

  AFRICA: {
    en: {
      title: "Edunancial",
      subtitle: "Structure before scale",
      body:
        "Capital follows structure. We focus on durability, not hype.",
      dir: "ltr",
    },
    fr: {
      title: "Edunancial",
      subtitle: "Structure avant l’expansion",
      body:
        "Le capital suit la structure, pas l’inverse.",
      dir: "ltr",
    },
  },

  EU: {
    en: {
      title: "Edunancial",
      subtitle: "Cross-border capital intelligence",
      body:
        "Understanding capital flows across regulatory environments.",
      dir: "ltr",
    },
    fr: {
      title: "Edunancial",
      subtitle: "Intelligence du capital transfrontalier",
      body:
        "Navigation entre juridictions et structures financières.",
      dir: "ltr",
    },
  },

  MENA: {
    ar: {
      title: "Edunancial",
      subtitle: "الهيكلة قبل التوسع",
      body:
        "رأس المال يتبع الهيكل، وليس العكس.",
      dir: "rtl",
    },
    en: {
      title: "Edunancial",
      subtitle: "Structure-first capital thinking",
      body:
        "Durable systems across regions.",
      dir: "ltr",
    },
  },
};

export function resolveCopy(
  region: Region,
  language: Language
): Copy {
  return (
    COPY[region][language] ??
    COPY[region][REGION_LANGUAGES[region][0]]
  );
}
