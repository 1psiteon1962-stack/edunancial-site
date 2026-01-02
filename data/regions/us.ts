// data/regions/us.ts

export const US_REGION = {
  regionKey: "us",
  currency: "USD",
  languages: ["en", "es"],

  pricing: {
    level1: {
      price: 0,
      label: {
        en: "Free",
        es: "Gratis",
      },
    },
    level2: {
      price: 19,
      label: {
        en: "$19 / month",
        es: "$19 / mes",
      },
    },
    level3: {
      price: 49,
      label: {
        en: "$49 / month",
        es: "$49 / mes",
      },
    },
  },
};
