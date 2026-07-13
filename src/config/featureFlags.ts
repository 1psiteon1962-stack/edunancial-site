// ======================================================
// FEATURE FLAGS
// FILE 1039
// ======================================================

export interface FeatureFlags {
  dashboard: boolean;
  assessments: boolean;
  learningPaths: boolean;
  decisionLabs: boolean;
  caseStudies: boolean;
  businessAI: boolean;
  investmentAI: boolean;
  realEstateAI: boolean;
  executiveAI: boolean;
  countryPricing: boolean;
  marketplace: boolean;
  community: boolean;
  analytics: boolean;
}

export const DefaultFeatures: FeatureFlags = {
  dashboard: true,
  assessments: true,
  learningPaths: true,
  decisionLabs: true,
  caseStudies: true,
  businessAI: true,
  investmentAI: false,
  realEstateAI: false,
  executiveAI: false,
  countryPricing: false,
  marketplace: false,
  community: false,
  analytics: true,
};

// ======================================================
// EUROPE REGIONAL FEATURE FLAGS
// ======================================================

export interface EuropeRegionalFeatureFlags {
  gdprConsentBanner: boolean;
  cookiePreferenceCenter: boolean;
  dataPortabilityRequest: boolean;
  rightToErasureRequest: boolean;
  vatDisplay: boolean;
  multiCurrencyCheckout: boolean;
  psd2StrongAuthentication: boolean;
  hreflangAlternates: boolean;
  paypalEnabled: boolean;
  stripeEnabled: boolean;
  multilingual: boolean;
  vatOssSupport: boolean;
}

export const EUROPE_FEATURE_FLAGS: EuropeRegionalFeatureFlags = {
  gdprConsentBanner: true,
  cookiePreferenceCenter: true,
  dataPortabilityRequest: true,
  rightToErasureRequest: true,
  vatDisplay: true,
  multiCurrencyCheckout: true,
  psd2StrongAuthentication: true,
  hreflangAlternates: true,
  paypalEnabled: true,
  stripeEnabled: true,
  multilingual: true,
  vatOssSupport: false,
};

export const EUROPE_2A_FEATURE_FLAGS: EuropeRegionalFeatureFlags = {
  ...EUROPE_FEATURE_FLAGS,
  vatOssSupport: true,
};

export const EUROPE_2B_FEATURE_FLAGS: EuropeRegionalFeatureFlags = {
  ...EUROPE_FEATURE_FLAGS,
  vatOssSupport: true,
};

// ======================================================
// APAC REGIONAL FEATURE FLAGS
// ======================================================

export interface ApacFeatureFlags {
  apacRouting: boolean;
  apacLocaleSelector: boolean;
  apacRegionalPricing: boolean;
  apacCountryDetection: boolean;
  apacHreflang: boolean;
  apacPaymentProviders: boolean;
  apacJapanese: boolean;
  apacKorean: boolean;
  apacSimplifiedChinese: boolean;
  apacTraditionalChinese: boolean;
  apacHindi: boolean;
}

export const APAC_FEATURE_FLAGS: ApacFeatureFlags = {
  apacRouting: true,
  apacLocaleSelector: true,
  apacRegionalPricing: true,
  apacCountryDetection: true,
  apacHreflang: true,
  apacPaymentProviders: true,
  apacJapanese: true,
  apacKorean: true,
  apacSimplifiedChinese: true,
  apacTraditionalChinese: true,
  apacHindi: true,
};

// ======================================================
// AI COUNTRY SELECTION FEATURE FLAGS
// ======================================================

export interface AiCountryFeatureFlags {
  aiCountrySelection: boolean;
  aiCountryKnowledge: boolean;
  aiMultiCountryComparison: boolean;
}

export const AI_COUNTRY_FEATURE_FLAGS: AiCountryFeatureFlags = {
  aiCountrySelection: true,
  aiCountryKnowledge: true,
  aiMultiCountryComparison: false,
};

// ======================================================
// COMPLIANCE-GATED COUNTRY FLAGS
// Countries disabled pending compliance review.
// Language support remains installed regardless.
// ======================================================

export interface ComplianceGatedCountryFlags {
  chinaEnabled: boolean;
  russiaEnabled: boolean;
  belarusEnabled: boolean;
  iranEnabled: boolean;
  afghanistanEnabled: boolean;
}

export const COMPLIANCE_GATED_COUNTRY_FLAGS: ComplianceGatedCountryFlags = {
  chinaEnabled: false,
  russiaEnabled: false,
  belarusEnabled: false,
  iranEnabled: false,
  afghanistanEnabled: false,
};
