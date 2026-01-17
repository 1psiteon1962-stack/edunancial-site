export const supportedLanguages = ["en", "es"] as const;
export type Language = (typeof supportedLanguages)[number];

export const DEFAULT_LANGUAGE: Language = "en";

const dictionary = {
  en: {
    home: {
      title: "Financial Literacy, Structured for Real Life",
      subtitle:
        "Edunancial helps you understand where you are, where you want to go, and which proven paths can get you there.",
      levels: {
        title: "The Five Levels of Financial Thinking",
      },
      tracks: {
        title: "Three Proven Paths to Wealth",
      },
      cta: "Find Your Starting Level",
    },
    levels: {
      1: {
        title: "Level 1 — Survival & Stability",
        summary:
          "Focuses on income awareness, expenses, and financial survival.",
      },
      2: {
        title: "Level 2 — Control & Planning",
        summary:
          "Introduces budgeting, saving, and intentional decision-making.",
      },
      3: {
        title: "Level 3 — Growth & Leverage",
        summary:
          "Explores investing, compounding, and measured risk.",
      },
      4: {
        title: "Level 4 — Optimization & Protection",
        summary:
          "Emphasizes tax efficiency, asset protection, and systems.",
      },
      5: {
        title: "Level 5 — Ownership & Legacy",
        summary:
          "Centers on business ownership, scaling, and generational wealth.",
      },
    },
    tracks: {
      red: {
        title: "Red Track — Real Estate",
        desc: "Property, leverage, income, and long-term asset control.",
      },
      white: {
        title: "White Track — Paper Assets",
        desc: "Stocks, bonds, options, and financial instruments.",
      },
      blue: {
        title: "Blue Track — Business Ownership",
        desc: "Companies, cash flow, scaling, and enterprise value.",
      },
    },
  },

  es: {
    home: {
      title: "Educación Financiera para la Vida Real",
      subtitle:
        "Edunancial te ayuda a entender dónde estás, hacia dónde vas y qué caminos probados pueden llevarte allí.",
      levels: {
        title: "Los Cinco Niveles de Pensamiento Financiero",
      },
      tracks: {
        title: "Tres Caminos Probados hacia la Riqueza",
      },
      cta: "Descubre tu Nivel Inicial",
    },
    levels: {
      1: {
        title: "Nivel 1 — Supervivencia y Estabilidad",
        summary:
          "Enfoque en ingresos, gastos y estabilidad financiera.",
      },
      2: {
        title: "Nivel 2 — Control y Planificación",
        summary:
          "Presupuesto, ahorro y decisiones financieras conscientes.",
      },
      3: {
        title: "Nivel 3 — Crecimiento y Apalancamiento",
        summary:
          "Inversiones, interés compuesto y riesgo medido.",
      },
      4: {
        title: "Nivel 4 — Optimización y Protección",
        summary:
          "Eficiencia fiscal, protección de activos y sistemas.",
      },
      5: {
        title: "Nivel 5 — Propiedad y Legado",
        summary:
          "Empresas, expansión y riqueza generacional.",
      },
    },
    tracks: {
      red: {
        title: "Ruta Roja — Bienes Raíces",
        desc: "Propiedad, ingresos y control a largo plazo.",
      },
      white: {
        title: "Ruta Blanca — Activos Financieros",
        desc: "Acciones, bonos, opciones y mercados.",
      },
      blue: {
        title: "Ruta Azul — Negocios",
        desc: "Empresas, flujo de caja y crecimiento.",
      },
    },
  },
};

export function t(key: string, language: Language = DEFAULT_LANGUAGE): string {
  return key
    .split(".")
    .reduce((obj: any, k) => obj?.[k], dictionary[language]) ?? key;
}
