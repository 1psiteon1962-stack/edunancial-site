import {
  createZeroTaxQuote,
  shouldCollectTax,
  TaxEngineAdapter,
  TaxQuote,
  TaxQuoteRequest,
  jurisdictionKey,
} from "./architecture";

export interface UsSalesTaxRule {
  stateCode: string;
  combinedRate: number;
  taxableProductKinds: readonly TaxQuoteRequest["productKind"][];
  ruleVersionId: string;
  effectiveFrom: string;
  effectiveTo?: string;
}

export type UsSalesTaxRuleResolver = (
  request: TaxQuoteRequest,
) => UsSalesTaxRule | undefined;

function roundTax(amountMinor: number, ratePercent: number): number {
  return Math.round(amountMinor * (ratePercent / 100));
}

export function createUsSalesTaxAdapter(resolveRule: UsSalesTaxRuleResolver): TaxEngineAdapter {
  return {
    countryCode: "US",
    quote(request: TaxQuoteRequest): TaxQuote {
      if (request.customer.countryCode !== "US") {
        return createZeroTaxQuote(request, "US adapter only handles United States customer locations.");
      }
      if (request.subtotal.currency !== "USD") {
        return createZeroTaxQuote(request, "US sales-tax quote requires a USD subtotal.");
      }
      if (!request.customer.subdivisionCode) {
        return createZeroTaxQuote(request, "US state is required before tax can be determined.");
      }

      const rule = resolveRule(request);
      if (!rule) {
        return createZeroTaxQuote(
          request,
          "No versioned sales-tax rule is available for this jurisdiction and transaction date.",
        );
      }

      const taxable = rule.taxableProductKinds.includes(request.productKind);
      if (!taxable) {
        return {
          ...createZeroTaxQuote(request, "Product is not taxable under the resolved jurisdiction rule."),
          ruleVersionId: rule.ruleVersionId,
        };
      }

      const collectionRequired = shouldCollectTax(request.taxRegistration, request.nexus);
      if (!collectionRequired) {
        return {
          ...createZeroTaxQuote(request, "Economic/physical nexus or registration does not require collection."),
          taxable: true,
          ruleVersionId: rule.ruleVersionId,
        };
      }

      const amountMinor = roundTax(request.subtotal.amountMinor, rule.combinedRate);
      return {
        jurisdictionKey: jurisdictionKey(request.customer),
        taxable: true,
        collectionRequired: true,
        subtotal: request.subtotal,
        tax: { amountMinor, currency: "USD" },
        total: { amountMinor: request.subtotal.amountMinor + amountMinor, currency: "USD" },
        components: [{
          kind: "sales-tax",
          authority: rule.stateCode,
          rate: rule.combinedRate,
          amountMinor,
        }],
        ruleVersionId: rule.ruleVersionId,
        reason: `Versioned US sales-tax rule applied for ${rule.stateCode}.`,
      };
    },
  };
}
