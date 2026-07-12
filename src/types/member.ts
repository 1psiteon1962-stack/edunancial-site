import type { GlobalUserPreferences } from "@/lib/international/preference-architecture";

export interface Member {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  country: string;

  state?: string;

  city?: string;

  preferredLanguage: string;

  preferredCurrency: string;

  region?: string;

  timeZone?: string;

  dateFormat?: string;

  numberFormat?: string;

  measurementSystem?: "metric" | "imperial";

  preferredPaymentMethod?: string;

  preferences?: GlobalUserPreferences;

  membershipLevel: string;

  joinedDate: Date;

  lastLogin: Date;

  competencyScore: number | null;

  assessmentCompleted: boolean;

  aiCoachEnabled: boolean;
}
