/**
 * Canonical KPI type definition
 * Internal use only – feeds analytics, scoring, and capital-readiness metrics
 */

export type BusinessStage =
  | "idea"
  | "pre-revenue"
  | "early-revenue"
  | "scaling"
  | "institutional"
  | "unspecified";

export interface UserProfileKPI {
  /** System metadata */
  timestamp?: string;
  region?: string;

  /** Diagnostic-derived level (1–5 or named level) */
  level?: string;

  /** Business maturity indicators */
  businessStage?: BusinessStage;

  /** Identity & contact (internal only, never public) */
  name?: string;
  email?: string;
  phone?: string;
  country?: string;

  /** Business details */
  hasBusiness?: boolean;
  businessName?: string;
  formalBusiness?: boolean;

  /** Tracking + analytics */
  source?: string;
}
