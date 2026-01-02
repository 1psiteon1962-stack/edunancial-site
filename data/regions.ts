export const REGIONS = {
  us: {
    name: "United States",
    languages: ["en", "es"],
    currency: "USD",
  },
  europe: {
    name: "Europe",
    languages: ["en", "fr", "de", "es", "it"],
    currency: "EUR",
  },
  mena: {
    name: "Middle East & North Africa",
    languages: ["ar", "en", "fr"],
    currency: "USD",
  },
  asia: {
    name: "Asia Pacific",
    languages: ["en", "zh", "ja", "ko"],
    currency: "USD",
  },
  "asia-emerging": {
    name: "Asia Emerging",
    languages: ["en", "hi", "bn", "ur"],
    currency: "USD",
  },
  africa: {
    name: "Africa",
    languages: ["en", "fr", "sw", "ar"],
    currency: "USD",
  },
} as const;
