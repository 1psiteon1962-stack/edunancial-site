import { CARIBBEAN_COUNTRIES } from "./caribbeanCountries";

export function isCaribbean(countryCode: string): boolean {

  return CARIBBEAN_COUNTRIES.includes(
    countryCode.toUpperCase()
  );

}
