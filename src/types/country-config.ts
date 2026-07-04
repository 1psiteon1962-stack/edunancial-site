export type CountryStatus =
  | "research"
  | "planning"
  | "development"
  | "beta"
  | "live"
  | "suspended"
  | "disabled";

export interface CountryConfiguration {

  isoCode: string;

  country: string;

  continent: string;

  enabled: boolean;

  status: CountryStatus;

  membershipEnabled: boolean;

  marketplaceEnabled: boolean;

  paymentsEnabled: boolean;

  coursesEnabled: boolean;

  assessmentsEnabled: boolean;

  hiringEnabled: boolean;

  aiEnabled: boolean;

  operatingEntity: string;

  currency: string;

  language: string;

}
