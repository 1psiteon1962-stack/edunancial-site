import { getProvinceTax } from "@/config/canada";

import {
  createZeroTaxQuote,
  shouldCollectTax,
  TaxComponent,
  TaxComponentKind,
  TaxEngineAdapter,
  TaxQuote,
  TaxQuoteRequest,
  jurisdictionKey,
} from "./architecture";

function componentKind(label: string): TaxComponentKind {
  if (label.includes("HST")) return "hst";
  if (label.includes("QST")) return "qst";
  if (label.includes("RST")) return "rst";
  if (label.includes("PST")) return "pst";
  return "gst";
}

function roundTax(amountMinor: number, ratePercent: number): number {
  return Math.round(amountMinor * (ratePercent / 100));
}

export const canadaIndirectTaxAdapter: TaxEngineAdapter = {
  countryCode: "CA",
  quote(request: TaxQuoteRequest): TaxQuote {
    if (request.customer.countryCode !== "CA") {
      return createZeroTaxQuote(request, "Canada adapter only handles Canadian customer locations.");
    }
    if (request.subtotal.currency !== "CAD") {
      return createZeroTaxQuote(request, "Canadian tax quote requires a CAD subtotal.");
    }

    const provinceCode = request.customer.subdivisionCode?.toUpperCase();
    if (!provinceCode) return createZeroTaxQuote(request, "Canadian province or territory is required.");

    const provinceTax = getProvinceTax(provinceCode);
    if (!provinceTax) return createZeroTaxQuote(request, "Unknown Canadian province or territory.");

    const collectionRequired = shouldCollectTax(request.taxRegistration, request.nexus);
    if (!collectionRequired) {
      return {
        ...createZeroTaxQuote(request, "Tax registration/nexus does not currently require collection."),
        taxable: true,
      };
    }

    const components: TaxComponent[] = [];
    if (provinceTax.taxModel === "hst") {
      components.push({
        kind: "hst",
        authority: provinceCode,
        rate: provinceTax.totalRate,
        amountMinor: roundTax(request.subtotal.amountMinor, provinceTax.totalRate),
      });
    } else {
      if (provinceTax.gstRate > 0) {
        components.push({
          kind: "gst",
          authority: "CA",
          rate: provinceTax.gstRate,
          amountMinor: roundTax(request.subtotal.amountMinor, provinceTax.gstRate),
        });
      }
      if (provinceTax.provincialRate > 0) {
        components.push({
          kind: componentKind(provinceTax.taxLabel),
          authority: provinceCode,
          rate: provinceTax.provincialRate,
          amountMinor: roundTax(request.subtotal.amountMinor, provinceTax.provincialRate),
        });
      }
    }

    const taxAmountMinor = components.reduce((sum, component) => sum + component.amountMinor, 0);
    return {
      jurisdictionKey: jurisdictionKey(request.customer),
      taxable: true,
      collectionRequired: true,
      subtotal: request.subtotal,
      tax: { amountMinor: taxAmountMinor, currency: "CAD" },
      total: { amountMinor: request.subtotal.amountMinor + taxAmountMinor, currency: "CAD" },
      components,
      reason: `Canadian ${provinceTax.taxLabel} applied for ${provinceCode}.`,
    };
  },
};
