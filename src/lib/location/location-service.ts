import { countries } from "./countries";
import { regions } from "./regions";
import { cities } from "./cities";
import { getCountryPricingPolicy } from "./pricing";
import { marketplaceProviders } from "./marketplace";

export function getCountry(countryId: string) {
  return countries.find((country) => country.id === countryId);
}

export function getRegion(regionId: string) {
  return regions.find((region) => region.id === regionId);
}

export function getCity(cityId: string) {
  return cities.find((city) => city.id === cityId);
}

export function getPricing(countryId: string) {
  return getCountryPricingPolicy(countryId);
}

export function getMarketplace(countryId: string) {
  return marketplaceProviders.filter(
    (provider) => provider.countryId === countryId && provider.active,
  );
}
