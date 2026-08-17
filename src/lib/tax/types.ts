export type TaxCountry = "US" | "CA";

export type ProductTaxClassification =
  | "EDU-BOOK-PHYSICAL"
  | "EDU-EBOOK-DIGITAL"
  | "EDU-COURSE-RECORDED"
  | "EDU-COURSE-LIVE"
  | "EDU-MEMBERSHIP"
  | "EDU-SUBSCRIPTION"
  | "EDU-SAAS-TOOL"
  | "EDU-DIGITAL-DOWNLOAD"
  | "EDU-CONSULTING"
  | "EDU-MERCH-APPAREL"
  | "EDU-MERCH-GENERAL";

export type TaxType =
  | "US-SALES-TAX"
  | "US-GROSS-RECEIPTS"
  | "GST"
  | "HST"
  | "QST"
  | "PST"
  | "RST"
  | "OTHER";

export type NexusKind = "none" | "economic" | "physical" | "both";
export type RegistrationStatus = "not-required" | "monitoring" | "review" | "required" | "registered" | "suspended";
export type FilingStatus = "not-due" | "due" | "filed" | "overdue";
export type PaymentStatus = "not-due" | "due" | "paid" | "overdue";
export type VerificationStatus = "unverified" | "verified" | "stale" | "needs-review";
export type ThresholdStatus = "below-70" | "informational" | "review" | "prepare-registration" | "compliance-escalation" | "trigger-review";

export interface Money {
  amountMinor: number;
  currency: "USD" | "CAD" | string;
}

export interface CustomerTaxLocation {
  country: TaxCountry;
  stateProvince?: string;
  county?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  billingAddress?: string;
  serviceAddress?: string;
  locationEvidence?: string[];
}

export interface CurrencyConversionRecord {
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmountMinor: number;
  targetAmountMinor: number;
  rate: string;
  source: string;
  conversionDate: string;
}

export interface TaxRuleVersion {
  id: string;
  jurisdictionId: string;
  productClassification?: ProductTaxClassification;
  ruleType: "nexus" | "taxability" | "rate" | "sourcing" | "registration" | "filing" | "remittance";
  taxType?: TaxType;
  rateBasisPoints?: number;
  thresholdMinor?: number;
  thresholdCurrency?: string;
  transactionThreshold?: number | null;
  measurementMethod?: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
  sourceAuthority: string;
  sourceReference: string;
  dateVerified: string;
  verificationStatus: VerificationStatus;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface NexusSnapshot {
  jurisdictionId: string;
  physicalNexus: boolean;
  economicNexus: boolean;
  nexusKind: NexusKind;
  grossSalesMinor: number;
  qualifyingSalesMinor: number;
  taxableSalesMinor: number;
  exemptSalesMinor: number;
  transactionCount: number;
  thresholdMinor?: number;
  thresholdCurrency?: string;
  transactionThreshold?: number | null;
  thresholdUtilizationPercent?: number;
  projectedCrossingDate?: string | null;
  nexusTriggerDate?: string | null;
  statutoryCollectionStartDate?: string | null;
  registrationRequired: boolean;
  thresholdStatus: ThresholdStatus;
  ruleVersionIds: string[];
}

export interface TaxabilityDecision {
  jurisdictionId: string;
  productClassification: ProductTaxClassification;
  taxable: boolean | null;
  reason: string;
  ruleVersionId?: string;
  verificationStatus: VerificationStatus;
}

export interface TaxComponent {
  taxType: TaxType;
  jurisdictionId: string;
  rateBasisPoints: number;
  taxableBaseMinor: number;
  taxMinor: number;
  ruleVersionId: string;
}

export interface RateDecision {
  components: TaxComponent[];
  totalTaxMinor: number;
  complete: boolean;
  failureReason?: string;
}

export interface TaxRegistrationRecord {
  jurisdictionId: string;
  taxType: TaxType;
  authority: string;
  permitType?: string;
  accountNumberEncrypted?: string;
  registrationStatus: RegistrationStatus;
  registrationEffectiveDate?: string | null;
  filingFrequency?: string | null;
  nextReturnDate?: string | null;
  nextPaymentDate?: string | null;
}

export interface ComplianceLedgerEntry {
  id: string;
  jurisdictionId: string;
  taxType: TaxType;
  periodStart: string;
  periodEnd: string;
  taxCollectedMinor: number;
  taxRemittedMinor: number;
  outstandingLiabilityMinor: number;
  filingStatus: FilingStatus;
  paymentStatus: PaymentStatus;
  filedAt?: string | null;
  remittedAt?: string | null;
  paymentConfirmationReference?: string | null;
  lastReconciledAt?: string | null;
}

export interface TaxAuditEvent {
  id: string;
  occurredAt: string;
  actorType: "user" | "service" | "system";
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: unknown;
  newValue?: unknown;
  reason?: string;
  source?: string;
  approvalReference?: string;
}

export interface TaxCalculationRequest {
  transactionId: string;
  customerId?: string;
  location: CustomerTaxLocation;
  productClassification: ProductTaxClassification;
  customerType?: "consumer" | "business" | "exempt";
  subtotalMinor: number;
  discountMinor: number;
  currency: string;
  transactionDate: string;
  marketplace?: {
    name: string;
    facilitatorCollectedTax: boolean;
    facilitatorRemittedTax?: boolean;
  } | null;
  currencyConversion?: CurrencyConversionRecord | null;
}

export interface TaxCalculationResult {
  transactionId: string;
  jurisdictionIds: string[];
  nexus: NexusSnapshot[];
  taxability: TaxabilityDecision[];
  rates: RateDecision;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  finalChargeMinor: number;
  currency: string;
  ruleVersionIds: string[];
  status: "calculated" | "manual-review-required" | "marketplace-handled";
  alerts: string[];
}
