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

  "asia-pacific": {
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
};
