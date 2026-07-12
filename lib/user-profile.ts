import type { GlobalUserPreferences } from "../src/lib/international/preference-architecture";

/**
 * Canonical User Profile
 * INTERNAL SYSTEM TYPE
 * Used for admin views, analytics joins, and KPI correlation
 */

export interface UserProfile {
  /** Internal unique identifier */
  userId: string;

  /** Audit fields */
  createdAt: string;

  /** Identity */
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  region?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  timeZone?: string;
  dateFormat?: string;
  numberFormat?: string;
  measurementSystem?: "metric" | "imperial";
  preferredPaymentMethod?: string;
  preferences?: GlobalUserPreferences;

  /** Business context */
  hasBusiness?: boolean;
  businessName?: string;
  formalBusiness?: boolean;

  /** Derived / diagnostic */
  level?: string;
  businessStage?: string;
}
