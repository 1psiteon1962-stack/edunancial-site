// lib/i18n.ts

export type Language = "en" | "es" | "fr" | "ar";
export type Region = "US" | "LATAM" | "EU" | "AFRICA" | "MENA";

export type CopyContent = {
  title: string;
  subtitle: string;
  body: string;
  dir: "ltr" | "rtl";
};

/**
 * Languages allowed per region
 */
export const REGION_LANGUAGES: Record<Region, Language[]> = {
  US: ["en"],
  LATAM: ["es", "en"],
  EU: ["en", "fr"],
  AFRICA: ["en", "fr"],
  MENA: ["ar", "en"],
};

/**
 * Default language per region
 */
export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  US: "en",
  LATAM: "es",
  EU: "en",
  AFRICA: "en",
  MENA: "ar",
};

/**
 * Copy dictionary
 * NOTE: Partial is intentional — not all regions must be populated yet
 */
const COPY: Partial<
  Record<Region, Partial<Record<Language, CopyContent>>>
> = {
  US: {
    en: {
      title: "Edunancial",
      subtitle: "Capital literacy for real-world economies",
      body: "Building financial intelligence for a global generation.",
      dir: "ltr",
    },
  },

  LATAM: {
    es: {
      title: "Edunancial",
      subtitle: "Educación financiera para economías reales",
      body: "Construyendo inteligencia financiera para una generación global.",
      dir: "ltr",
    },
    en: {
      title: "Edunancial",
      subtitle: "Capital literacy for Latin America",
      body: "Financial education adapted to regional realities.",
      dir: "ltr",
    },
  },

  EU: {
    en: {
      title: "Edunancial Europe",
      subtitle: "Capital literacy for European markets",
      body: "Financial education aligned with EU regulatory and economic systems.",
      dir: "ltr",
    },
    fr: {
      title: "Edunancial Europe",
      subtitle: "Éducation financière pour les marchés européens",
      body: "Une approche structurée de la littératie financière en Europe.",
      dir: "ltr",
    },
  },

  AFRICA: {
    en: {
      title: "Edunancial Africa",
      subtitle: "Capital literacy for emerging markets",
      body: "Financial education designed for growth economies.",
      dir: "ltr",
    },
    fr: {
      title: "Edunancial Afrique",
      subtitle: "Éducation financière pour les marchés émergents",
      body: "Formation financière adaptée aux économies en croissance.",
      dir: "ltr",
    },
  },

  MENA: {
    ar: {
      title: "إيدونانشال",
      subtitle: "الثقافة المالية للأسواق الإقليمية",
      body: "التعليم المالي المصمم للاقتصادات الواقعية.",
      dir: "rtl",
    },
    en: {
      title: "Edunancial MENA",
      subtitle: "Capital literacy for the Middle East & North Africa",
      body: "Financial education aligned with regional systems.",
      dir: "ltr",
    },
  },
};

/**
 * Resolve copy safely
 */
export function resolveCopy(region: Region, lang: Language) {
  return COPY[region]?.[lang];
}
