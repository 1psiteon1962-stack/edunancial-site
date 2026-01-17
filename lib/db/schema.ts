export type BusinessType =
  | "informal"
  | "sole_proprietor"
  | "llc"
  | "corporation"
  | "partnership";

export interface ParticipantProfile {
  id: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  country: string;
  state: string;
  city: string;
  postalCode: string;

  hasBusiness: boolean;
  businessName?: string;
  businessCountry?: string;
  businessState?: string;
  businessType?: BusinessType;
  industry?: string;

  entryLevel: 1 | 2 | 3 | 4 | 5;
  trackInterest: Array<"red" | "white" | "blue">;

  language: string;
  region: string;

  createdAt: string;
}
