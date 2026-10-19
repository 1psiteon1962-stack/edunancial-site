import { normalizeLanguageCode } from "./languages";

export type PricingPageCopy = {
  globalTitle: string;
  globalBody: string;
  globalTagline: string;
  levels12: string;
  levels14: string;
  levels15: string;
  allTracks: string;
  mostPopular: string;
  completeAccess: string;
  perYear: string;
  save: (amount: string) => string;
  bestAnnualValue: string;
  basicDescription: string;
  premiumDescription: string;
  enterpriseDescription: string;
  cancelAnytime: string;
  monthly: string;
  annual: string;
  localPricesNote: (countryName: string) => string;
  purchaseNotOpen: string;
};

const en: PricingPageCopy = {
  globalTitle: "Financial education built for a global audience.",
  globalBody:
    "Learn across 8 financial tracks and 5 progressive levels, with content available in multiple languages and regional language options.",
  globalTagline: "🌐 Multiple languages · Regional language options · Learn in the language that works for you",
  levels12: "Levels 1–2",
  levels14: "Levels 1–4",
  levels15: "Levels 1–5",
  allTracks: "All 8 learning tracks",
  mostPopular: "Most Popular",
  completeAccess: "Complete Access",
  perYear: "/ year",
  save: (amount) => `Save ${amount} versus 12 monthly payments`,
  bestAnnualValue: "Best annual value",
  basicDescription:
    "Build financial literacy and develop the practical skills to make more informed financial decisions.",
  premiumDescription:
    "Move beyond financial literacy into applied financial competency, strategy, and increasingly complex real-world decisions.",
  enterpriseDescription:
    "Complete access from foundational financial literacy through advanced financial competency, analysis, and strategic decision-making.",
  cancelAnytime: "Cancel anytime.",
  monthly: "Monthly",
  annual: "Annual",
  localPricesNote: (countryName) => `Prices shown in your local currency for ${countryName}.`,
  purchaseNotOpen: "Online purchase in your country opens soon. Contact us to join early.",
};

const es: PricingPageCopy = {
  globalTitle: "Educación financiera creada para una audiencia global.",
  globalBody:
    "Aprende en 8 áreas financieras y 5 niveles progresivos, con contenido disponible en varios idiomas y variantes regionales.",
  globalTagline: "🌐 Varios idiomas · Variantes regionales · Aprende en el idioma que te funcione",
  levels12: "Niveles 1–2",
  levels14: "Niveles 1–4",
  levels15: "Niveles 1–5",
  allTracks: "Las 8 áreas de aprendizaje",
  mostPopular: "El más popular",
  completeAccess: "Acceso completo",
  perYear: "/ año",
  save: (amount) => `Ahorras ${amount} frente a 12 pagos mensuales`,
  bestAnnualValue: "Mejor valor anual",
  basicDescription:
    "Desarrolla tu alfabetización financiera y las destrezas prácticas para tomar decisiones financieras mejor informadas.",
  premiumDescription:
    "Ve más allá de la alfabetización financiera hacia la competencia financiera aplicada, la estrategia y decisiones reales cada vez más complejas.",
  enterpriseDescription:
    "Acceso completo, desde la alfabetización financiera básica hasta la competencia financiera avanzada, el análisis y la toma de decisiones estratégicas.",
  cancelAnytime: "Cancela cuando quieras.",
  monthly: "Mensual",
  annual: "Anual",
  localPricesNote: (countryName) => `Precios en la moneda local de ${countryName}.`,
  purchaseNotOpen: "La compra en línea en tu país abrirá pronto. Contáctanos para unirte desde ahora.",
};

export function getPricingPageCopy(languageCode: string): PricingPageCopy {
  const base = normalizeLanguageCode(languageCode).toLowerCase().split("-")[0];
  if (base === "es") return es;
  return en;
}

const COUNTRY_NAMES: Record<string, { en: string; es: string }> = {
  DO: { en: "the Dominican Republic", es: "República Dominicana" },
};

export function getPricingCountryName(countryCode: string, languageCode: string): string {
  const names = COUNTRY_NAMES[countryCode.toUpperCase()];
  if (!names) return countryCode.toUpperCase();
  const base = normalizeLanguageCode(languageCode).toLowerCase().split("-")[0];
  return base === "es" ? names.es : names.en;
}
