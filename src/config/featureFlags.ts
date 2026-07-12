// ======================================================
// FEATURE FLAGS
// FILE 1039
// ======================================================

export interface FeatureFlags{

dashboard:boolean;

assessments:boolean;

learningPaths:boolean;

decisionLabs:boolean;

caseStudies:boolean;

businessAI:boolean;

investmentAI:boolean;

realEstateAI:boolean;

executiveAI:boolean;

countryPricing:boolean;

marketplace:boolean;

community:boolean;

analytics:boolean;

}

export const DefaultFeatures:FeatureFlags={

dashboard:true,

assessments:true,

learningPaths:true,

decisionLabs:true,

caseStudies:true,

businessAI:true,

investmentAI:false,

realEstateAI:false,

executiveAI:false,

countryPricing:false,

marketplace:false,

community:false,

analytics:true,

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

