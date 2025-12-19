// data/site-configs.ts

const siteConfigs = {
  siteName: "Edunancial",
  tagline: "Financial Literacy Without Borders",

  defaultLanguage: "en",
  supportedLanguages: ["en", "es"],

  regions: {
    US: {
      currency: "USD",
      enabled: true,
    },
    AFRICA: {
      currency: "USD",
      enabled: true,
    },
    LATAM: {
      currency: "USD",
      enabled: true,
    },
    EU: {
      currency: "EUR",
      enabled: false,
    },
  },

  contact: {
    supportEmail: "support@edunancial.com",
  },
};

export default siteConfigs;
