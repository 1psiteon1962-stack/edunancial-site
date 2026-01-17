export type AgeRange =
  | "under_18"
  | "18_24"
  | "25_34"
  | "35_44"
  | "45_54"
  | "55_64"
  | "65_plus";

export type BusinessStatus =
  | "no_business"
  | "informal_business"
  | "formal_llc"
  | "formal_corp"
  | "other";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  country: string;
  state?: string;
  city?: string;
  postalCode?: string;

  ageRange: AgeRange;

  hasBusiness: boolean;
  businessName?: string;
  businessJurisdiction?: string;
  businessStatus?: BusinessStatus;

  createdAt: string;
}
