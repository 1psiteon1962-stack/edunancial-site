// src/config/europe/deployment.ts
// Europe regional deployment configuration.
// All values describe infrastructure intent; no runtime secrets are stored here.

export const EUROPE_DEPLOYMENT_CONFIG = {
  region: "europe",
  subRegions: ["europe-2a", "europe-2b"] as const,

  cdn: {
    primaryRegion: "eu-west-1",
    fallbackRegion: "eu-central-1",
    preferredEdgeLocations: ["Frankfurt", "Paris", "London", "Amsterdam", "Warsaw"],
    cacheControlPublic: "public, max-age=31536000, immutable",
    cacheControlPages: "public, s-maxage=60, stale-while-revalidate=300",
  },

  dataResidency: {
    primaryZone: "EU",
    allowedRegions: ["eu-west-1", "eu-central-1", "eu-north-1"],
    prohibitedRegions: [],
    gdprDataResidencyRequired: true,
  },

  envVarKeys: {
    stripe: "STRIPE_SECRET_KEY",
    stripePublic: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    stripeWebhookSecret: "STRIPE_WEBHOOK_SECRET",
    paypalClientId: "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    paypalClientSecret: "PAYPAL_CLIENT_SECRET",
    paypalWebhookId: "PAYPAL_WEBHOOK_ID",
  },

  nextjsConfig: {
    defaultLocale: "en",
    locales: ["en", "fr", "de", "es", "it", "pt"],
    hreflangMap: {
      en: "en-GB",
      fr: "fr-FR",
      de: "de-DE",
      es: "es-ES",
      it: "it-IT",
      pt: "pt-PT",
    },
  },

  headers: {
    contentSecurityPolicy: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.paypal.com",
      "frame-src https://js.stripe.com https://www.paypal.com",
      "connect-src 'self' https://api.stripe.com https://api.paypal.com",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
    ].join("; "),
    permissionsPolicy: "interest-cohort=()",
    referrerPolicy: "strict-origin-when-cross-origin",
  },

  complianceChecklist: [
    "GDPR Data Processing Agreement (DPA) executed with Stripe and PayPal",
    "Cookie consent banner deployed and tested per ePrivacy Directive",
    "Data Subject Access Request (DSAR) workflow operational",
    "Right to Erasure endpoint implemented and tested",
    "Data Portability endpoint implemented and tested",
    "Privacy Policy reviewed by EU-qualified legal counsel",
    "Terms of Service reviewed for each launch market",
    "VAT registration / OSS enrollment confirmed with tax counsel",
    "PSD2 Strong Customer Authentication (SCA) tested in live mode",
    "Stripe Radar rules configured for EU fraud prevention",
  ],
} as const;
