// data/regionContent.ts

export const regionContent: Record<string, any> = {
  us: {
    languages: {
      en: {
        title: "United States Curriculum",
        description: "Financial literacy aligned with U.S. systems.",
        curriculum: [
          "Banking & Credit",
          "Taxes & IRS",
          "Investing Basics",
          "Business Formation",
        ],
        pricing: "$29/month",
      },
      es: {
        title: "Currículo de Estados Unidos",
        description: "Educación financiera adaptada a EE.UU.",
        curriculum: [
          "Banca y Crédito",
          "Impuestos",
          "Inversión Básica",
          "Formación de Empresas",
        ],
        pricing: "$29/mes",
      },
    },
  },

  europe: {
    languages: {
      en: {
        title: "Europe Curriculum",
        description: "EU-focused financial education.",
        curriculum: [
          "EU Banking",
          "VAT & Taxation",
          "Cross-Border Investing",
          "Entrepreneurship",
        ],
        pricing: "€24/month",
      },
      fr: {
        title: "Programme Européen",
        description: "Éducation financière pour l'Europe.",
        curriculum: [
          "Banques Européennes",
          "TVA",
          "Investissement",
          "Entrepreneuriat",
        ],
        pricing: "€24/mois",
      },
      es: {
        title: "Programa Europeo",
        description: "Educación financiera europea.",
        curriculum: [
          "Banca Europea",
          "IVA",
          "Inversión",
          "Emprendimiento",
        ],
        pricing: "€24/mes",
      },
    },
  },

  africa: {
    languages: {
      en: {
        title: "Africa Curriculum",
        description: "Mobile-first financial systems.",
        curriculum: [
          "Mobile Money",
          "Microfinance",
          "Entrepreneurship",
        ],
        pricing: "$10/month",
      },
    },
  },

  mena: {
    languages: {
      en: {
        title: "MENA Curriculum",
        description: "Sharia-aware financial education.",
        curriculum: [
          "Islamic Finance",
          "Business Ethics",
          "Asset Protection",
        ],
        pricing: "$19/month",
      },
      ar: {
        title: "المنهج المالي",
        description: "التعليم المالي لمنطقة الشرق الأوسط",
        curriculum: [
          "التمويل الإسلامي",
          "الأعمال",
          "حماية الأصول",
        ],
        pricing: "19$ شهريًا",
      },
    },
  },

  asia: {
    languages: {
      en: {
        title: "Asia Curriculum",
        description: "High-growth market education.",
        curriculum: [
          "Digital Payments",
          "Equities",
          "Startups",
        ],
        pricing: "$15/month",
      },
    },
  },

  "asia-emerging": {
    languages: {
      en: {
        title: "Emerging Asia Curriculum",
        description: "Foundational financial systems.",
        curriculum: [
          "Savings",
          "Credit Basics",
          "Small Business",
        ],
        pricing: "$7/month",
      },
    },
  },

  pacific: {
    languages: {
      en: {
        title: "Pacific Curriculum",
        description: "Island and remote economies.",
        curriculum: [
          "Tourism Finance",
          "Local Enterprise",
          "Sustainability",
        ],
        pricing: "$9/month",
      },
    },
  },
};
