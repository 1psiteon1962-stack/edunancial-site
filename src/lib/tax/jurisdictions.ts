import type { CustomerTaxLocation, TaxCalculationRequest } from "./types";
import type { JurisdictionResolver } from "./engine";

const CA_PROVINCES = new Set(["AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK", "NT", "NU", "YT"]);
const US_STATES = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
]);

function clean(value?: string): string | undefined {
  const result = value?.trim().toUpperCase();
  return result || undefined;
}

export function validateTaxLocation(location: CustomerTaxLocation): string[] {
  const errors: string[] = [];
  const region = clean(location.stateProvince);
  if (!location.country) errors.push("country is required");
  if (location.country === "US" && (!region || !US_STATES.has(region))) errors.push("valid US state is required");
  if (location.country === "CA" && (!region || !CA_PROVINCES.has(region))) errors.push("valid Canadian province/territory is required");
  if (!location.postalCode) errors.push("postal code is required for production tax determination");
  return errors;
}

export class UsCanadaJurisdictionResolver implements JurisdictionResolver {
  async resolve(request: TaxCalculationRequest): Promise<string[]> {
    if (validateTaxLocation(request.location).length) return [];
    const country = request.location.country;
    const region = clean(request.location.stateProvince)!;
    const ids = [`${country}`, `${country}-${region}`];

    // Preserve local dimensions independently. These are identifiers only;
    // actual tax applicability comes from effective-dated sourced rules.
    if (country === "US") {
      if (request.location.county) ids.push(`US-${region}-COUNTY:${request.location.county.trim().toUpperCase()}`);
      if (request.location.city) ids.push(`US-${region}-CITY:${request.location.city.trim().toUpperCase()}`);
      if (request.location.district) ids.push(`US-${region}-DISTRICT:${request.location.district.trim().toUpperCase()}`);
    }

    // Canadian federal GST/HST and provincial regimes remain independent
    // records even when both apply to one transaction.
    if (country === "CA") {
      ids.push("CA-FEDERAL");
      if (region === "QC") ids.push("CA-QC-QST");
      if (region === "BC") ids.push("CA-BC-PST");
      if (region === "SK") ids.push("CA-SK-PST");
      if (region === "MB") ids.push("CA-MB-RST");
    }
    return [...new Set(ids)];
  }
}
