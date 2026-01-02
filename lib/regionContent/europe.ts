export type CurriculumContent = {
  title: string;
  description: string;
  curriculum: string[];
  pricing: {
    currency: string;
    monthly: number;
    annual: number;
  };
};

export const europeContent: Record<string, CurriculumContent> = {
  en: {
    title: "European Financial Literacy Program",
    description:
      "A structured financial education curriculum tailored to European regulatory, banking, and investment environments.",
    curriculum: [
      "Personal Budgeting & Cash Flow",
      "EU Banking Systems & SEPA",
      "Credit, Lending, and Consumer Protection",
      "Investing Basics (Stocks, ETFs, Pensions)",
      "Entrepreneurship & Cross-Border Business",
      "Tax Awareness & VAT Fundamentals",
    ],
    pricing: {
      currency: "EUR",
      monthly: 19,
      annual: 190,
    },
  },
  es: {
    title: "Programa Europeo de Educación Financiera",
    description:
      "Un plan estructurado de educación financiera adaptado al marco bancario, fiscal y regulatorio europeo.",
    curriculum: [
      "Presupuesto personal y flujo de efectivo",
      "Sistema bancario europeo y SEPA",
      "Crédito, préstamos y protección al consumidor",
      "Inversión básica (acciones, ETFs, pensiones)",
      "Emprendimiento y negocios transfronterizos",
      "Conciencia fiscal y fundamentos del IVA",
    ],
    pricing: {
      currency: "EUR",
      monthly: 19,
      annual: 190,
    },
  },
  fr: {
    title: "Programme Européen d’Éducation Financière",
    description:
      "Un programme structuré d’éducation financière adapté aux réalités bancaires et réglementaires européennes.",
    curriculum: [
      "Gestion du budget personnel",
      "Système bancaire européen et SEPA",
      "Crédit et protection des consommateurs",
      "Bases de l’investissement (actions, ETF, retraites)",
      "Entrepreneuriat et commerce transfrontalier",
      "Fiscalité et TVA",
    ],
    pricing: {
      currency: "EUR",
      monthly: 19,
      annual: 190,
    },
  },
  de: {
    title: "Europäisches Finanzbildungsprogramm",
    description:
      "Ein strukturiertes Finanzbildungsprogramm für die europäischen Markt- und Regulierungssysteme.",
    curriculum: [
      "Persönliche Budgetplanung",
      "Europäisches Bankensystem & SEPA",
      "Kredite und Verbraucherschutz",
      "Grundlagen der Geldanlage",
      "Unternehmertum & grenzüberschreitender Handel",
      "Steuern & Mehrwertsteuer",
    ],
    pricing: {
      currency: "EUR",
      monthly: 19,
      annual: 190,
    },
  },
};
