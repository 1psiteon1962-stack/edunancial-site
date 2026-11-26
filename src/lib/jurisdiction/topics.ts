/**
 * Controlled vocabulary for jurisdiction-sensitive lesson topics and
 * universal legal-form archetypes. Lessons are mapped to topics in
 * curriculum/lesson-topics.json (sidecar; committed lessons are never edited).
 * Country fact sheets map their local rules and entity forms onto these keys,
 * so adding a country is data entry, not new code.
 */
export const JURISDICTION_TOPICS = [
  "business-formation",
  "entity-liability",
  "personal-income-tax",
  "corporate-income-tax",
  "consumption-tax",
  "advance-tax-payments",
  "withholding-tax",
  "depreciation-expensing",
  "capital-gains",
  "gain-deferral-rollover",
  "real-estate-transfer",
  "property-tax",
  "mortgage-lending",
  "landlord-tenant",
  "retirement-accounts",
  "payroll-employment",
  "social-security",
  "consumer-credit",
  "credit-reporting",
  "banking-deposit-insurance",
  "securities-investing",
  "insurance",
  "inheritance-estate",
  "intellectual-property",
  "bankruptcy-insolvency",
  "foreign-exchange-controls",
  "cross-border",
  "sanctions-trade-restrictions",
] as const;

export type JurisdictionTopic = (typeof JURISDICTION_TOPICS)[number];

export function isJurisdictionTopic(value: string): value is JurisdictionTopic {
  return (JURISDICTION_TOPICS as readonly string[]).includes(value);
}

/** Universal business-form archetypes; local forms map onto these. */
export const ENTITY_ARCHETYPES = [
  "sole-proprietor",
  "general-partnership",
  "limited-partnership",
  "limited-liability-partnership",
  "limited-liability-company",
  "corporation",
  "simplified-stock-company",
  "cooperative",
  "nonprofit",
  "state-enterprise",
] as const;

export type EntityArchetype = (typeof ENTITY_ARCHETYPES)[number];

/** Universal consumption/indirect-tax archetypes. */
export const CONSUMPTION_TAX_ARCHETYPES = [
  "vat",
  "gst",
  "sales-tax",
  "turnover-tax",
  "excise",
  "none",
] as const;

export type ConsumptionTaxArchetype = (typeof CONSUMPTION_TAX_ARCHETYPES)[number];
