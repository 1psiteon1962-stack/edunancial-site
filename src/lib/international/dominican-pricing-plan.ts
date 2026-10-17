/** Prepared Dominican Republic membership prices, not active checkout offers.
 * A single approval-controlled source for future displayed and charged prices.
 * Pricing follows the existing Dominican pilot: whole-DOP retail values.
 * The controlling checkout remains US/CA-only until payment and tax validation.
 */
export const DOMINICAN_MEMBERSHIP_PRICE_PLAN = {
  countryCode: "DO",
  currency: "DOP",
  status: "DRAFT",
  version: "do-pilot-v1",
  basic: { monthly: 399, annual: 3199 },
  premium: { monthly: 699, annual: 5599 },
  enterprise: { monthly: 999, annual: 7999 },
} as const;

export function getDominicanPlannedPrices(plan: "basic" | "premium" | "enterprise") {
  return DOMINICAN_MEMBERSHIP_PRICE_PLAN[plan];
}
