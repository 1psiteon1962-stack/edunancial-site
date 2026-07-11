import {CountryProfile} from "./countryProfile";
import {
APAC_FOUNDATION_COUNTRIES,
isApacAudienceEnabled
} from "@/lib/regionalization/apacFoundation";

const apacProfiles:CountryProfile[]=APAC_FOUNDATION_COUNTRIES.map((country)=>({
country:country.country,
isoCode:country.isoCode,
language:country.languages.map((language)=>language.label),
currency:country.currency.code,
currencySymbol:country.currency.symbol,
timezone:country.timezone,
paymentProviders:country.paymentProviders,
defaultMembership:country.pricing.monthly,
recommendedCoursePrice:country.pricing.flagshipCourse,
marketplaceEnabled:country.capabilities.marketplace&&isApacAudienceEnabled(country.id,"public"),
startupHubEnabled:country.capabilities.courses&&isApacAudienceEnabled(country.id,"public"),
fundingCenterEnabled:country.capabilities.payments&&isApacAudienceEnabled(country.id,"public"),
voiceAIEnabled:country.capabilities.ai&&isApacAudienceEnabled(country.id,"public"),
locales:country.languages.map((language)=>language.locale),
launchControls:country.launchControls,
founderControlsEnabled:country.capabilities.founderControls,
betaTesterControlsEnabled:country.capabilities.betaTesterControls,
taxConfiguration:country.tax,
complianceConfiguration:country.compliance,
seoLocale:country.seo.locale
}));

export const CountryRegistry:CountryProfile[]=[

{

country:"United States",

isoCode:"US",

language:["English","Spanish"],

currency:"USD",

currencySymbol:"$",

timezone:"America/New_York",

paymentProviders:["Stripe","PayPal"],

defaultMembership:29.99,

recommendedCoursePrice:149,

marketplaceEnabled:true,

startupHubEnabled:true,

fundingCenterEnabled:true,

voiceAIEnabled:true

},

...apacProfiles

];
