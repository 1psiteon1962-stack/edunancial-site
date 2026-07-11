export const REGION_COMPLIANCE: Record<
  string,
  {
    dataProtection: string;
    payments: string;
    contentRestrictions: string;
  }
> = {
  us: {
    dataProtection: "CCPA / state-level privacy laws",
    payments: "Stripe, PayPal, cards",
    contentRestrictions: "Low",
  },

  mena: {
    dataProtection: "Country-specific data residency rules",
    payments: "Cards, local gateways",
    contentRestrictions: "Moderate to high",
  },

  europe: {
    dataProtection: "GDPR",
    payments: "PSD2-compliant processors",
    contentRestrictions: "Moderate",
  },

  "europe-2a": {
    dataProtection: "GDPR",
    payments: "PSD2-compliant processors",
    contentRestrictions: "Moderate",
  },

  "europe-2b": {
    dataProtection: "GDPR",
    payments: "PSD2-compliant processors",
    contentRestrictions: "Moderate",
  },

  "asia-pacific": {
    dataProtection: "Mixed national frameworks",
    payments: "Cards, wallets, local rails",
    contentRestrictions: "Moderate",
  },

  asia: {
    dataProtection: "Mixed national frameworks",
    payments: "Cards, wallets, local rails",
    contentRestrictions: "Moderate",
  },

  "asia-emerging": {
    dataProtection: "Developing regulatory frameworks",
    payments: "Mobile wallets, prepaid",
    contentRestrictions: "Low to moderate",
  },

  caribbean: {
    dataProtection: "Hybrid US/EU influenced standards",
    payments: "Cards, remittance-linked systems",
    contentRestrictions: "Low",
  },

  africa: {
    dataProtection: "Regional and country-level data protection requirements",
    payments: "Cards, mobile money, bank transfers",
    contentRestrictions: "Low to moderate",
  },

  "middle-east": {
    dataProtection: "Country-specific privacy and residency controls",
    payments: "Cards, local gateways, bank rails",
    contentRestrictions: "Moderate to high",
  },

  "latin-america-2a": {
    dataProtection: "Country-specific privacy frameworks",
    payments: "Cards, wallets, local transfers",
    contentRestrictions: "Low to moderate",
  },

  "latin-america-2b": {
    dataProtection: "Country-specific privacy frameworks",
    payments: "Cards, wallets, local transfers",
    contentRestrictions: "Low to moderate",
  },

  "north-america": {
    dataProtection: "CCPA / state-level privacy laws",
    payments: "Stripe, PayPal, cards",
    contentRestrictions: "Low",
  },

  oceania: {
    dataProtection: "Australia and New Zealand privacy frameworks",
    payments: "Cards, wallets, bank transfers",
    contentRestrictions: "Low",
  },
};
