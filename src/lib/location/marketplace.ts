export type MarketplaceCategory =
  | "attorney"
  | "accountant"
  | "real-estate"
  | "mortgage"
  | "insurance"
  | "financial-advisor"
  | "business-consultant"
  | "tax-professional"
  | "bank"
  | "other";

export interface MarketplaceProvider {
  id: string;

  countryId: string;
  regionId: string;
  cityId: string;

  category: MarketplaceCategory;

  company: string;
  contactName?: string;

  website?: string;
  email?: string;
  phone?: string;

  verified: boolean;
  featured: boolean;
  active: boolean;
}

export const marketplaceProviders: MarketplaceProvider[] = [

  // ====================================
  // UNITED STATES
  // ====================================

  {
    id: "sample-us-attorney",

    countryId: "us",
    regionId: "ca",
    cityId: "los-angeles",

    category: "attorney",

    company: "Sample California Attorney",

    verified: false,
    featured: false,
    active: false,
  },

  {
    id: "sample-us-accountant",

    countryId: "us",
    regionId: "ca",
    cityId: "los-angeles",

    category: "accountant",

    company: "Sample CPA",

    verified: false,
    featured: false,
    active: false,
  },

  // ====================================
  // UGANDA
  // ====================================

  {
    id: "sample-uganda-business",

    countryId: "ug",
    regionId: "ug-central",
    cityId: "kampala",

    category: "business-consultant",

    company: "Coming Soon",

    verified: false,
    featured: false,
    active: false,
  },

  // ====================================
  // NIGERIA
  // ====================================

  {
    id: "sample-nigeria-attorney",

    countryId: "ng",
    regionId: "ng-lagos",
    cityId: "lagos",

    category: "attorney",

    company: "Coming Soon",

    verified: false,
    featured: false,
    active: false,
  },

  // ====================================
  // SOUTH AFRICA
  // ====================================

  {
    id: "sample-sa-accountant",

    countryId: "za",
    regionId: "za-gauteng",
    cityId: "johannesburg",

    category: "accountant",

    company: "Coming Soon",

    verified: false,
    featured: false,
    active: false,
  },

];

export function getMarketplaceByCountry(
  countryId: string
) {
  return marketplaceProviders.filter(
    provider =>
      provider.countryId === countryId &&
      provider.active
  );
}

export function getMarketplaceByRegion(
  countryId: string,
  regionId: string
) {
  return marketplaceProviders.filter(
    provider =>
      provider.countryId === countryId &&
      provider.regionId === regionId &&
      provider.active
  );
}

export function getMarketplaceByCity(
  countryId: string,
  regionId: string,
  cityId: string
) {
  return marketplaceProviders.filter(
    provider =>
      provider.countryId === countryId &&
      provider.regionId === regionId &&
      provider.cityId === cityId &&
      provider.active
  );
}

export function getMarketplaceByCategory(
  countryId: string,
  category: MarketplaceCategory
) {
  return marketplaceProviders.filter(
    provider =>
      provider.countryId === countryId &&
      provider.category === category &&
      provider.active
  );
}
