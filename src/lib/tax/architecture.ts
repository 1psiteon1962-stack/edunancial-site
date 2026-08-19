export type TaxCountryCode = string;
export type TaxRegistrationStatus = "not-required" | "monitoring" | "required" | "registered" | "inactive";
export type TaxProductKind = "digital-course" | "membership" | "ebook" | "physical-book" | "service" | "other";
export type TaxComponentKind = string;
export type TaxDecisionStatus = "calculated" | "not-taxable" | "not-required" | "manual-review-required";

export interface MoneyAmount { amountMinor: number; currency: string; }
export interface TaxAddress { countryCode: TaxCountryCode; subdivisionCode?: string; postalCode?: string; city?: string; }
export interface TaxComponent { kind: TaxComponentKind; authority: string; rate: number; amountMinor: number; }
export interface TaxRuleVersion { id: string; countryCode: TaxCountryCode; subdivisionCode?: string; effectiveFrom: string; effectiveTo?: string; source?: string; notes?: string; }
export interface TaxRegistration { countryCode: TaxCountryCode; subdivisionCode?: string; status: TaxRegistrationStatus; registrationId?: string; registeredAt?: string; filingFrequency?: "monthly" | "quarterly" | "annual" | "other"; }
export interface NexusThreshold { countryCode: TaxCountryCode; subdivisionCode?: string; currency: string; salesThresholdMinor?: number; transactionThreshold?: number; lookback: "calendar-year" | "previous-calendar-year" | "rolling-12-months" | "other"; effectiveFrom: string; effectiveTo?: string; }
export interface NexusSnapshot { countryCode: TaxCountryCode; subdivisionCode?: string; currency: string; taxableSalesMinor: number; transactionCount: number; periodStart: string; periodEnd: string; threshold?: NexusThreshold; registrationStatus: TaxRegistrationStatus; }
export interface TaxQuoteRequest { sellerCountryCode: TaxCountryCode; customer: TaxAddress; productKind: TaxProductKind; subtotal: MoneyAmount; transactionAt: string; customerType?: "consumer" | "business"; taxRegistration?: TaxRegistration; nexus?: NexusSnapshot; }
export interface TaxQuote { jurisdictionKey: string; taxable: boolean; collectionRequired: boolean; subtotal: MoneyAmount; tax: MoneyAmount; total: MoneyAmount; components: TaxComponent[]; ruleVersionId?: string; reason: string; status?: TaxDecisionStatus; }
export interface TaxEngineAdapter { readonly countryCode: TaxCountryCode; quote(request: TaxQuoteRequest): TaxQuote; }

export function jurisdictionKey(address: TaxAddress): string {
  return [address.countryCode, address.subdivisionCode, address.postalCode].filter(Boolean).join("-").toUpperCase();
}

export function shouldCollectTax(registration: TaxRegistration | undefined, nexus: NexusSnapshot | undefined): boolean {
  if (registration?.status === "registered" || registration?.status === "required") return true;
  if (!nexus?.threshold) return false;
  const salesReached = nexus.threshold.salesThresholdMinor !== undefined && nexus.taxableSalesMinor >= nexus.threshold.salesThresholdMinor;
  const transactionsReached = nexus.threshold.transactionThreshold !== undefined && nexus.transactionCount >= nexus.threshold.transactionThreshold;
  return salesReached || transactionsReached;
}

export function createZeroTaxQuote(request: TaxQuoteRequest, reason: string, status: TaxDecisionStatus = "not-required"): TaxQuote {
  return { jurisdictionKey: jurisdictionKey(request.customer), taxable: false, collectionRequired: false, subtotal: request.subtotal, tax: { amountMinor: 0, currency: request.subtotal.currency }, total: request.subtotal, components: [], reason, status };
}

export function createManualReviewQuote(request: TaxQuoteRequest, reason: string): TaxQuote {
  return createZeroTaxQuote(request, reason, "manual-review-required");
}
