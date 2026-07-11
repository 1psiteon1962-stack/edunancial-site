import type {
  LaunchControls,
  RegionalComplianceConfiguration,
  RegionalTaxConfiguration,
} from "@/lib/regionalization/apacFoundation";

export interface CountryProfile{

country:string;

isoCode:string;

language:string[];

currency:string;

currencySymbol:string;

timezone:string;

paymentProviders:string[];

defaultMembership:number;

recommendedCoursePrice:number;

marketplaceEnabled:boolean;

startupHubEnabled:boolean;

fundingCenterEnabled:boolean;

voiceAIEnabled:boolean;

locales?:string[];

launchControls?:LaunchControls;

founderControlsEnabled?:boolean;

betaTesterControlsEnabled?:boolean;

taxConfiguration?:RegionalTaxConfiguration;

complianceConfiguration?:RegionalComplianceConfiguration;

seoLocale?:string;

}

export const DefaultCountry="United States";
