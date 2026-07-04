import { countries } from "./country-registry";

export function getEnabledCountries() {

  return countries.filter(
    country => country.enabled
  );

}

export function getDisabledCountries() {

  return countries.filter(
    country => !country.enabled
  );

}

export function getCountryByISO(
  isoCode: string
) {

  return countries.find(
    country => country.isoCode === isoCode
  );

}
