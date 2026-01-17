export type Language = "en" | "es";

export const DEFAULT_LANGUAGE: Language = "en";

export const translations = {
  en: {
    toggle: "Español",
    heroTitle: "Financial literacy for real life",
    heroSubtitle:
      "Clear thinking around money, assets, and ownership. Built for real people.",
    redTitle: "Real Estate (Red)",
    redDesc:
      "Property, land, and income-producing real estate. One of the oldest wealth paths.",
    whiteTitle: "Paper Assets (White)",
    whiteDesc:
      "Stocks, options, bonds, and structured investments. Ownership through markets.",
    blueTitle: "Business Ownership (Blue)",
    blueDesc:
      "Companies, equity, and systems that create income beyond your time.",
    disclaimer:
      "This platform provides general financial literacy information only. It is not financial, legal, or investment advice.",
  },
  es: {
    toggle: "English",
    heroTitle: "Educación financiera para la vida real",
    heroSubtitle:
      "Pensamiento claro sobre dinero, activos y propiedad. Hecho para personas reales.",
    redTitle: "Bienes Raíces (Rojo)",
    redDesc:
      "Propiedad, terrenos e inmuebles que generan ingresos. Uno de los caminos más antiguos hacia la riqueza.",
    whiteTitle: "Activos de Papel (Blanco)",
    whiteDesc:
      "Acciones, opciones, bonos e inversiones estructuradas. Propiedad a través de los mercados.",
    blueTitle: "Negocios (Azul)",
    blueDesc:
      "Empresas, participación accionaria y sistemas que generan ingresos más allá de tu tiempo.",
    disclaimer:
      "Esta plataforma proporciona información general de educación financiera. No constituye asesoramiento financiero, legal ni de inversión.",
  },
} as const;

export function t(
  key: keyof typeof translations.en,
  lang: Language
): string {
  return translations[lang][key];
}
