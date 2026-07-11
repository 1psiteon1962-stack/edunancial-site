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

apacFoundation:boolean;

apacRegionalPricing:boolean;

apacTax:boolean;

apacCompliance:boolean;

apacSeo:boolean;

founderControls:boolean;

betaTesterControls:boolean;

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

apacFoundation:false,

apacRegionalPricing:false,

apacTax:false,

apacCompliance:false,

apacSeo:false,

founderControls:false,

betaTesterControls:false,

};
