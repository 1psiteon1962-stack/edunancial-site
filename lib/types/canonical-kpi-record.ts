// lib/types/canonical-kpi-record.ts

/**
 * Canonical KPI record stored in the ledger.
 *
 * IMPORTANT:
 * All timestamps must be ISO STRINGS (not Date objects),
 * because Netlify/Next build enforces strict typing.
 */
export type CanonicalKPIRecord = {
  /**
   * Unique user identifier (required)
   */
  userId: string;

  /**
   * Subscription plan code
   */
  plan: string;

  /**
   * Account creation timestamp (ISO string)
   */
  createdAt: string;

  /**
   * Last activity timestamp (ISO string)
   */
  lastActiveAt: string;
};
