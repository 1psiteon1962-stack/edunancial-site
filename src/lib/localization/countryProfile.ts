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

}

export const DefaultCountry="United States";
