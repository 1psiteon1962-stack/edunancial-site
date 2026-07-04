import { countryPayments } from "./countries";
import { paymentProviders } from "./providers";

export function getCountryPaymentConfiguration(
  countryId: string
) {
  return countryPayments.find(
    country => country.countryId === countryId
  );
}

export function getDefaultPaymentProvider(
  countryId: string
) {
  const config = getCountryPaymentConfiguration(countryId);

  if (!config) {
    return null;
  }

  return paymentProviders.find(
    provider =>
      provider.id === config.defaultProvider
  );
}

export function getAvailablePaymentProviders(
  countryId: string
) {
  const config = getCountryPaymentConfiguration(countryId);

  if (!config) {
    return [];
  }

  return paymentProviders.filter(provider =>
    config.providers.includes(provider.id)
  );
}
