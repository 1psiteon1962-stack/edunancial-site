import type {
  ComplianceLedgerEntry,
  NexusSnapshot,
  RateDecision,
  TaxCalculationRequest,
  TaxCalculationResult,
  TaxRegistrationRecord,
  TaxRuleVersion,
  TaxabilityDecision,
  ThresholdStatus,
} from "./types";

export interface TaxRuleRepository {
  getEffectiveRules(input: {
    jurisdictionIds: string[];
    transactionDate: string;
    productClassification?: TaxCalculationRequest["productClassification"];
  }): Promise<TaxRuleVersion[]>;
}

export interface NexusEngine {
  evaluate(request: TaxCalculationRequest, rules: TaxRuleVersion[]): Promise<NexusSnapshot[]>;
}

export interface TaxabilityEngine {
  evaluate(request: TaxCalculationRequest, rules: TaxRuleVersion[]): Promise<TaxabilityDecision[]>;
}

export interface RateEngine {
  evaluate(
    request: TaxCalculationRequest,
    decisions: TaxabilityDecision[],
    rules: TaxRuleVersion[],
  ): Promise<RateDecision>;
}

export interface ComplianceEngine {
  getRegistrations(jurisdictionIds: string[]): Promise<TaxRegistrationRecord[]>;
  recordTransaction(result: TaxCalculationResult): Promise<void>;
  getLedger(jurisdictionIds: string[]): Promise<ComplianceLedgerEntry[]>;
  raiseAlert(input: { transactionId: string; jurisdictionIds: string[]; reason: string }): Promise<void>;
}

export interface JurisdictionResolver {
  resolve(request: TaxCalculationRequest): Promise<string[]>;
}

export function thresholdStatus(percent: number | undefined): ThresholdStatus {
  if (percent == null || percent < 70) return "below-70";
  if (percent < 80) return "informational";
  if (percent < 90) return "review";
  if (percent < 95) return "prepare-registration";
  if (percent < 100) return "compliance-escalation";
  return "trigger-review";
}

export function projectThresholdCrossingDate(input: {
  qualifyingSalesMinor: number;
  thresholdMinor: number;
  periodSalesMinor: number;
  periodDays: number;
  asOfDate: string;
}): string | null {
  const { qualifyingSalesMinor, thresholdMinor, periodSalesMinor, periodDays, asOfDate } = input;
  if (qualifyingSalesMinor >= thresholdMinor) return asOfDate;
  if (periodSalesMinor <= 0 || periodDays <= 0) return null;
  const dailyVelocity = periodSalesMinor / periodDays;
  if (dailyVelocity <= 0) return null;
  const remaining = thresholdMinor - qualifyingSalesMinor;
  const days = Math.ceil(remaining / dailyVelocity);
  const date = new Date(`${asOfDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export class TaxOrchestrator {
  constructor(
    private readonly jurisdictionResolver: JurisdictionResolver,
    private readonly ruleRepository: TaxRuleRepository,
    private readonly nexusEngine: NexusEngine,
    private readonly taxabilityEngine: TaxabilityEngine,
    private readonly rateEngine: RateEngine,
    private readonly complianceEngine: ComplianceEngine,
  ) {}

  async calculate(request: TaxCalculationRequest): Promise<TaxCalculationResult> {
    const jurisdictionIds = await this.jurisdictionResolver.resolve(request);
    if (!jurisdictionIds.length) {
      await this.complianceEngine.raiseAlert({
        transactionId: request.transactionId,
        jurisdictionIds: [],
        reason: "Tax jurisdiction could not be determined",
      });
      return this.manualReview(request, [], [], "Tax jurisdiction could not be determined");
    }

    const rules = await this.ruleRepository.getEffectiveRules({
      jurisdictionIds,
      transactionDate: request.transactionDate,
      productClassification: request.productClassification,
    });

    const nexus = await this.nexusEngine.evaluate(request, rules);
    const taxability = await this.taxabilityEngine.evaluate(request, rules);

    if (taxability.some((decision) => decision.taxable == null || decision.verificationStatus !== "verified")) {
      const reason = "Taxability is not confidently verified for this transaction";
      await this.complianceEngine.raiseAlert({ transactionId: request.transactionId, jurisdictionIds, reason });
      return this.manualReview(request, jurisdictionIds, nexus, reason, taxability, rules);
    }

    if (request.marketplace?.facilitatorCollectedTax) {
      const result: TaxCalculationResult = {
        transactionId: request.transactionId,
        jurisdictionIds,
        nexus,
        taxability,
        rates: { components: [], totalTaxMinor: 0, complete: true },
        subtotalMinor: request.subtotalMinor,
        discountMinor: request.discountMinor,
        taxMinor: 0,
        finalChargeMinor: Math.max(0, request.subtotalMinor - request.discountMinor),
        currency: request.currency,
        ruleVersionIds: rules.map((rule) => rule.id),
        status: "marketplace-handled",
        alerts: ["Marketplace facilitator reports tax collection; prevent duplicate collection and retain marketplace evidence."],
      };
      await this.complianceEngine.recordTransaction(result);
      return result;
    }

    const rates = await this.rateEngine.evaluate(request, taxability, rules);
    if (!rates.complete) {
      const reason = rates.failureReason ?? "Applicable tax rate could not be determined";
      await this.complianceEngine.raiseAlert({ transactionId: request.transactionId, jurisdictionIds, reason });
      return this.manualReview(request, jurisdictionIds, nexus, reason, taxability, rules, rates);
    }

    const taxableSubtotal = Math.max(0, request.subtotalMinor - request.discountMinor);
    const result: TaxCalculationResult = {
      transactionId: request.transactionId,
      jurisdictionIds,
      nexus,
      taxability,
      rates,
      subtotalMinor: request.subtotalMinor,
      discountMinor: request.discountMinor,
      taxMinor: rates.totalTaxMinor,
      finalChargeMinor: taxableSubtotal + rates.totalTaxMinor,
      currency: request.currency,
      ruleVersionIds: rules.map((rule) => rule.id),
      status: "calculated",
      alerts: nexus
        .filter((entry) => entry.thresholdStatus !== "below-70")
        .map((entry) => `${entry.jurisdictionId}: ${entry.thresholdStatus}`),
    };
    await this.complianceEngine.recordTransaction(result);
    return result;
  }

  private manualReview(
    request: TaxCalculationRequest,
    jurisdictionIds: string[],
    nexus: NexusSnapshot[],
    reason: string,
    taxability: TaxabilityDecision[] = [],
    rules: TaxRuleVersion[] = [],
    rates: RateDecision = { components: [], totalTaxMinor: 0, complete: false, failureReason: reason },
  ): TaxCalculationResult {
    return {
      transactionId: request.transactionId,
      jurisdictionIds,
      nexus,
      taxability,
      rates,
      subtotalMinor: request.subtotalMinor,
      discountMinor: request.discountMinor,
      taxMinor: 0,
      finalChargeMinor: Math.max(0, request.subtotalMinor - request.discountMinor),
      currency: request.currency,
      ruleVersionIds: rules.map((rule) => rule.id),
      status: "manual-review-required",
      alerts: [reason],
    };
  }
}
