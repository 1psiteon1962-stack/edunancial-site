export type CopyBlock = {
  title: string;
  body: string;
};

export type Region = "AFRICA" | "LATAM" | "US";
export type Language = "en" | "es" | "fr";

const COPY: Record<Region, Record<Language, CopyBlock>> = {
  AFRICA: {
    en: {
      title: "Africa: Discipline Before Scale",
      body:
        "In many African economies, discipline and cash-flow clarity come before long-term scale. Edunancial focuses on immediate survival skills first, then structured growth."
    },
    es: {
      title: "África: Disciplina Antes de Escalar",
      body:
        "En muchas economías africanas, la disciplina y el flujo de efectivo vienen antes del crecimiento a largo plazo."
    },
    fr: {
      title: "Afrique : Discipline Avant l’Expansion",
      body:
        "Dans de nombreuses économies africaines, la discipline et la clarté du flux de trésorerie précèdent l’expansion."
    }
  },

  LATAM: {
    en: {
      title: "Latin America: Structured Hustle",
      body:
        "Latin America blends urgency with opportunity. Edunancial bridges informal hustle with formal systems."
    },
    es: {
      title: "Latinoamérica: Esfuerzo Estructurado",
      body:
        "Latinoamérica combina urgencia con oportunidad."
    },
    fr: {
      title: "Amérique Latine : Effort Structuré",
      body:
        "L’Amérique latine combine urgence et opportunité."
    }
  },

  US: {
    en: {
      title: "United States: Optimization & Scale",
      body:
        "The U.S. market focuses on optimization, leverage, and compounding systems."
    },
    es: {
      title: "Estados Unidos: Optimización y Escala",
      body:
        "El mercado estadounidense se enfoca en optimización y apalancamiento."
    },
    fr: {
      title: "États-Unis : Optimisation et Échelle",
      body:
        "Le marché américain se concentre sur l’optimisation."
    }
  }
};

export function resolveCopy(
  region: Region,
  lang: Language
): CopyBlock {
  return COPY[region][lang] ?? COPY[region]["en"];
}
