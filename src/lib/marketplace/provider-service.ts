import { MarketplaceProvider } from "@/types/marketplace";

const providers: MarketplaceProvider[] = [];

export function getProviders() {

  return providers;

}

export function getProvidersByCountry(
  country: string
) {

  return providers.filter(
    provider => provider.country === country
  );

}

export function addProvider(
  provider: MarketplaceProvider
) {

  providers.push(provider);

}
