import type { CatalogItemType } from "@/lib/payments/catalog";
import type { TaxProductKind } from "./architecture";
import { calculateRuntimeTax, type RuntimeTaxDecision } from "./runtime-calculator";

export interface CheckoutTaxInput {
  countryCode: string;
  subdivisionCode?: string;
  postalCode?: string;
  city?: string;
  itemType: CatalogItemType;
  subtotalMinor: number;
  currency: string;
  transactionAt?: string;
}

export type CheckoutTaxResolution =
  | { status: "location-required"; reason: string }
  | { status: "manual-review-required"; decision: RuntimeTaxDecision }
  | { status: "resolved"; decision: RuntimeTaxDecision };

export function mapCatalogItemToTaxProductKind(itemType: CatalogItemType): TaxProductKind {
  switch (itemType) {
    case "membership_monthly":
    case "membership_annual":
      return "membership";
    case "course":
    case "live_training":
    case "webinar":
    case "certification":
      return "digital-course";
    case "digital_product":
      return "ebook";
    case "book":
      return "physical-book";
    case "consultation":
      return "service";
    default:
      return "other";
  }
}

export async function resolveCheckoutTax(input: CheckoutTaxInput): Promise<CheckoutTaxResolution> {
  const countryCode = input.countryCode.trim().toUpperCase();
  const subdivisionCode = input.subdivisionCode?.trim().toUpperCase();

  // US and Canadian indirect tax decisions generally require a state/province.
  // Do not guess a jurisdiction from IP, currency, or browser locale.
  if ((countryCode === "US" || countryCode === "CA") && !subdivisionCode) {
    return {
      status: "location-required",
      reason: `${countryCode === "US" ? "State" : "Province/territory"} is required before tax can be calculated.`,
    };
  }

  const decision = await calculateRuntimeTax({
    sellerCountryCode: "US",
    customer: {
      countryCode,
      subdivisionCode,
      postalCode: input.postalCode?.trim() || undefined,
      city: input.city?.trim() || undefined,
    },
    productKind: mapCatalogItemToTaxProductKind(input.itemType),
    subtotal: {
      amountMinor: input.subtotalMinor,
      currency: input.currency.trim().toUpperCase(),
    },
    transactionAt: input.transactionAt ?? new Date().toISOString(),
  });

  if (decision.quote.status === "manual-review-required") {
    return { status: "manual-review-required", decision };
  }
  return { status: "resolved", decision };
}
