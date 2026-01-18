/**
 * Canonical KPI type definition
 * INTERNAL USE ONLY
 * Supports analytics, diagnostics, and capital-readiness metrics
 */

export type BusinessStage =
  | "idea"
  | "pre-revenue"
  | "early-revenue"
  | "scaling"
  | "institutional"
  | "unspecified";

export interface UserProfileKPI {
  /** Unique internal identifier (not public) */
  userId?: string;

  /** System metadata */
  timestamp?: string;
  region?: string;
  source?: string;

  /** Diagnostic-derived level (Level 1–5 or named track) */
  level?: string;

  /** Business maturity indicators */
  businessStage?: BusinessStage;

  /** Identity & contact (internal analytics only) */
  name?: string;
  email?: string;
  phone?: string;
  country?: string;

  /** Business details */
  hasBusiness?: boolean;
  businessName?: string;
  formalBusiness?: boolean;
}
