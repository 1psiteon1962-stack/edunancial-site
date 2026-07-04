import { countries } from "./countries";
import { regions } from "./regions";
import { cities } from "./cities";
import { pricing } from "./pricing";
import { marketplaceProviders } from "./marketplace";

export function getCountry(countryId: string) {
  return countries.find(c => c.id === countryId);
}

export function getRegion(regionId: string) {
  return regions.find(r => r.id === regionId);
}

export function getCity(cityId: string) {
  return cities.find(c => c.id === cityId);
}

export function getPricing(countryId: string) {
  return pricing.find(p => p.countryId === countryId);
}

export function getMarketplace(countryId: string) {
  return marketplaceProviders.filter(
    provider =>
      provider.countryId === countryId &&
      provider.active
  );
}
