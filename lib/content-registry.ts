// lib/content-registry.ts

export type Region =
  | "US"
  | "LATAM"
  | "CARIBBEAN"
  | "AFRICA"
  | "GLOBAL";

export type ContentSection = {
  id: string;
  title: string;
  description: string;
  body?: string;
};

export type ContentRegistry = {
  title: string;
  subtitle?: string;
  sections: ContentSection[];
};

/**
 * Region-aware content registry.
 * This matches the existing call: getContent(region)
 */
export function getContent(region: Region): ContentRegistry {
  switch (region) {
    case "LATAM":
      return {
        title: "Educación Financiera para la Vida Real",
        subtitle:
          "Entiende dónde estás hoy y cómo avanzar con claridad y estructura.",
        sections: [
          {
            id: "fundamentos",
            title: "Fundamentos",
            description:
              "Bases claras sobre dinero, negocios y control financiero personal."
          },
          {
            id: "crecimiento",
            title: "Crecimiento",
            description:
              "Herramientas prácticas para aumentar ingresos y proteger activos."
          }
        ]
      };

    case "CARIBBEAN":
      return {
        title: "Financial Literacy for Caribbean Markets",
        subtitle:
          "Built for real economies, real risks, and real opportunity.",
        sections: [
          {
            id: "foundation",
            title: "Foundation",
            description:
              "Understand money flow, legal structures, and economic reality."
          },
          {
            id: "resilience",
            title: "Resilience",
            description:
              "Learn how to survive volatility and build long-term stability."
          }
        ]
      };

    case "AFRICA":
      return {
        title: "Financial Structure Before Capital",
        subtitle:
          "Knowledge first. Structure second. Capital last.",
        sections: [
          {
            id: "structure",
            title: "Structure",
            description:
              "Learn how to formalize ideas into real, scalable entities."
          },
          {
            id: "execution",
            title: "Execution",
            description:
              "Turn opportunity into operating systems."
          }
        ]
      };

    case "US":
    case "GLOBAL":
    default:
      return {
        title: "Financial Literacy, Structured for Real Life",
        subtitle:
          "Understand where you are, what comes next, and how to move forward with confidence.",
        sections: [
          {
            id: "foundation",
            title: "Foundation",
            description:
              "Learn the fundamentals of money, business structures, and personal financial control."
          },
          {
            id: "growth",
            title: "Growth",
            description:
              "Apply practical tools to grow income, protect assets, and make informed decisions."
          },
          {
            id: "advancement",
            title: "Advancement",
            description:
              "Access advanced models and strategies used by experienced operators."
          }
        ]
      };
  }
}
