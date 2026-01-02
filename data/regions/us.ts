// data/regions/us.ts

export const US_REGION = {
  region: "United States",
  currency: "USD",
  defaultLanguage: "en",
  languages: ["en", "es"],

  tiers: [
    {
      id: "starter",
      level: "Beginner",
      price: {
        monthly: 19,
        annual: 190,
      },
      en: {
        title: "Financial Foundations",
        description:
          "Learn how money actually works in the U.S. — banking, credit, taxes, and protection.",
        modules: [
          "How the U.S. financial system works",
          "Banking, checking, savings, and fees",
          "Credit scores, reports, and leverage",
          "Taxes explained (W-2, 1099, deductions)",
          "Avoiding common financial traps",
        ],
        cta: "Start Building Financial Control",
      },
      es: {
        title: "Fundamentos Financieros",
        description:
          "Aprenda cómo funciona realmente el dinero en EE.UU. — banca, crédito, impuestos y protección.",
