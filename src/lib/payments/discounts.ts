/**
 * Discount Code and Promotional Pricing
 *
 * Supports percentage-based and fixed-amount discount codes.
 * Codes can have optional expiry dates and per-code usage limits.
 *
 * To add a promotional code, extend the DISCOUNT_CATALOG array below.
 * No changes to the payment or checkout pipeline are required.
 */

export type DiscountType = "percentage" | "fixed";

export interface DiscountCode {
  /** The code customers enter at checkout (case-insensitive). */
  code: string;
  /** Human-readable description shown in the checkout summary. */
  description: string;
  /** Whether this discount reduces by a percentage or a fixed amount. */
  type: DiscountType;
  /** For percentage discounts: value between 0 and 100. For fixed: amount in major currency units. */
  value: number;
  /** ISO 8601 date string after which the code is no longer valid.  Omit for no expiry. */
  expiresAt?: string;
  /** Maximum number of times the code can be redeemed globally.  Omit for unlimited. */
  maxRedemptions?: number;
  /** Catalog item IDs this code applies to.  Empty array means it applies to all items. */
  applicableItemIds?: string[];
  /** Whether the code is active. */
  active: boolean;
}

export interface DiscountResult {
  valid: boolean;
  code?: DiscountCode;
  discountAmount: number;
  finalPrice: number;
  errorMessage?: string;
}

/**
 * Promotional code registry.
 *
 * Add codes here.  Set active: false to disable a code without removing it.
 */
const DISCOUNT_CATALOG: DiscountCode[] = [
  // Example — disabled until a real campaign is configured:
  // {
  //   code: "LAUNCH20",
  //   description: "20% off for launch week subscribers",
  //   type: "percentage",
  //   value: 20,
  //   expiresAt: "2027-01-01T00:00:00Z",
  //   active: false,
  // },
];

/** Redemption counter — in-memory; replace with DB in production. */
const redemptionCounts = new Map<string, number>();

/**
 * Validate a discount code against a catalog item price.
 *
 * @param rawCode  The code entered by the customer.
 * @param itemId   The catalog item ID being purchased.
 * @param basePrice  The item's base price before any discount.
 * @param currency  The item's currency (not currently used but available for future FX logic).
 */
export function applyDiscountCode(
  rawCode: string,
  itemId: string,
  basePrice: number,
  _currency: string
): DiscountResult {
  const normalised = rawCode.trim().toUpperCase();
  const discount = DISCOUNT_CATALOG.find(
    (d) => d.code.toUpperCase() === normalised && d.active
  );

  if (!discount) {
    return {
      valid: false,
      discountAmount: 0,
      finalPrice: basePrice,
      errorMessage: "Invalid or expired discount code.",
    };
  }

  // Check expiry.
  if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
    return {
      valid: false,
      discountAmount: 0,
      finalPrice: basePrice,
      errorMessage: "This discount code has expired.",
    };
  }

  // Check applicable items.
  if (
    discount.applicableItemIds &&
    discount.applicableItemIds.length > 0 &&
    !discount.applicableItemIds.includes(itemId)
  ) {
    return {
      valid: false,
      discountAmount: 0,
      finalPrice: basePrice,
      errorMessage: "This discount code does not apply to the selected item.",
    };
  }

  // Check usage limit.
  if (discount.maxRedemptions !== undefined) {
    const used = redemptionCounts.get(normalised) ?? 0;
    if (used >= discount.maxRedemptions) {
      return {
        valid: false,
        discountAmount: 0,
        finalPrice: basePrice,
        errorMessage: "This discount code has reached its usage limit.",
      };
    }
  }

  // Calculate discount amount.
  let discountAmount = 0;
  if (discount.type === "percentage") {
    discountAmount = Math.round(basePrice * (discount.value / 100) * 100) / 100;
  } else {
    discountAmount = Math.min(discount.value, basePrice);
  }

  const finalPrice =
    Math.round((basePrice - discountAmount) * 100) / 100;

  return {
    valid: true,
    code: discount,
    discountAmount,
    finalPrice,
  };
}

/**
 * Record a successful code redemption.
 * Call this only after the payment has been confirmed server-side.
 */
export function recordDiscountRedemption(rawCode: string): void {
  const normalised = rawCode.trim().toUpperCase();
  const current = redemptionCounts.get(normalised) ?? 0;
  redemptionCounts.set(normalised, current + 1);
}

/** List all discount codes (for admin view). */
export function listDiscountCodes(): DiscountCode[] {
  return [...DISCOUNT_CATALOG];
}

/** Reset redemption counts — for tests only. */
export function resetDiscountRedemptionsForTests(): void {
  redemptionCounts.clear();
}
