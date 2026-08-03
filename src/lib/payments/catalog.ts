/**
 * Unified Payment Catalog
 *
 * Every purchasable item on the Edunancial platform is represented as a
 * PaymentCatalogItem.  New product types (events, certifications, books,
 * donations, etc.) are added here via configuration rather than new payment
 * code paths.  The checkout API and webhook handler consume this catalog
 * generically, so no product-specific payment logic is needed elsewhere.
 */

export type CatalogItemType =
  | "membership_monthly"
  | "membership_annual"
  | "course"
  | "digital_product"
  | "book"
  | "event_registration"
  | "certification"
  | "consultation"
  | "donation"
  | "live_training"
  | "webinar"
  | "other";

export interface PaymentCatalogItem {
  /** Unique item identifier (URL-safe slug). */
  id: string;
  /** Human-readable display name sent to Square and shown on receipts. */
  name: string;
  /** Short description shown in checkout summary. */
  description: string;
  /** Product type — drives lifecycle behaviour after payment. */
  type: CatalogItemType;
  /** Price in major currency units (e.g. 39.99 USD). */
  price: number;
  /** ISO 4217 currency code (e.g. "USD"). */
  currency: string;
  /** True for recurring subscriptions (monthly / annual). */
  isRecurring: boolean;
  /** Recurring interval — only set when isRecurring is true. */
  recurringInterval?: "monthly" | "annual";
  /**
   * For membership items: the canonical MembershipPlanId used to activate
   * the member's tier after a successful payment.
   */
  membershipPlanId?: string;
  /**
   * For course, book, certification, etc.: the entity identifier that gets
   * unlocked / provisioned after payment.
   */
  contentId?: string;
  /**
   * Whether this item is available for purchase through the public checkout.
   * Set to false to hide items that are invitation-only or not yet live.
   */
  active: boolean;
  /** Arbitrary key/value metadata forwarded to Square and stored in the order. */
  metadata?: Record<string, string>;
}

/**
 * The canonical product catalog.
 *
 * To add a new purchasable item:
 *   1. Add an entry here.
 *   2. Set `active: true` when the item is ready for sale.
 *   3. No new payment code is required — the unified checkout handles it.
 */
export const paymentCatalog: PaymentCatalogItem[] = [
  // ── Memberships ──────────────────────────────────────────────────────────
  {
    id: "membership-basic-monthly",
    name: "Individual Membership — Monthly",
    description:
      "Structured learning resources, guided sessions, practical exercises, and member tools for financial literacy and competency growth.",
    type: "membership_monthly",
    price: 39.99,
    currency: "USD",
    isRecurring: true,
    recurringInterval: "monthly",
    membershipPlanId: "basic",
    active: true,
  },
  {
    id: "membership-basic-annual",
    name: "Individual Membership — Annual",
    description:
      "Full-year access at a discounted annual rate. Same benefits as the monthly plan.",
    type: "membership_annual",
    price: 299.88,
    currency: "USD",
    isRecurring: true,
    recurringInterval: "annual",
    membershipPlanId: "basic",
    active: true,
  },
  {
    id: "membership-premium-monthly",
    name: "Pro Membership — Monthly",
    description:
      "Expanded member benefits with deeper learning access, downloads, and AI financial coach support.",
    type: "membership_monthly",
    price: 69.99,
    currency: "USD",
    isRecurring: true,
    recurringInterval: "monthly",
    membershipPlanId: "premium",
    active: true,
  },
  {
    id: "membership-enterprise-monthly",
    name: "Gold Membership — Monthly",
    description:
      "Full membership access for advanced learners with priority support and premium tools.",
    type: "membership_monthly",
    price: 99.99,
    currency: "USD",
    isRecurring: true,
    recurringInterval: "monthly",
    membershipPlanId: "enterprise",
    active: true,
  },

  // ── Courses (example — add real course IDs as they become available) ──────
  // {
  //   id: "course-financial-foundations",
  //   name: "Financial Foundations Course",
  //   description: "Build the core financial literacy skills every adult needs.",
  //   type: "course",
  //   price: 49.0,
  //   currency: "USD",
  //   isRecurring: false,
  //   contentId: "financial-foundations",
  //   active: false,
  // },

  // ── Books ─────────────────────────────────────────────────────────────────
  // {
  //   id: "book-financial-competency-guide",
  //   name: "The Financial Competency Guide",
  //   description: "Digital edition of the Edunancial flagship guide.",
  //   type: "book",
  //   price: 19.99,
  //   currency: "USD",
  //   isRecurring: false,
  //   contentId: "financial-competency-guide",
  //   active: false,
  // },

  // ── Events (coming soon) ──────────────────────────────────────────────────
  // {
  //   id: "event-live-training-q3-2026",
  //   name: "Live Financial Training — Q3 2026",
  //   description: "Interactive live session on building financial competency.",
  //   type: "event_registration",
  //   price: 79.0,
  //   currency: "USD",
  //   isRecurring: false,
  //   contentId: "live-training-q3-2026",
  //   active: false,
  // },
];

/** Resolve a catalog item by its ID. Returns undefined if not found. */
export function getCatalogItem(id: string): PaymentCatalogItem | undefined {
  return paymentCatalog.find((item) => item.id === id);
}

/** Return all active (purchasable) catalog items, optionally filtered by type. */
export function getActiveCatalogItems(
  type?: CatalogItemType
): PaymentCatalogItem[] {
  const active = paymentCatalog.filter((item) => item.active);
  return type ? active.filter((item) => item.type === type) : active;
}

/**
 * Resolve a catalog item from either a direct catalog ID or a legacy
 * membership plan ID (e.g. "basic", "premium", "enterprise").
 *
 * This allows the checkout API to accept both the new unified IDs and legacy
 * plan IDs used by the existing checkout components.
 */
export function resolveCatalogItem(
  id: string
): PaymentCatalogItem | undefined {
  // Try direct catalog ID first.
  const direct = getCatalogItem(id);
  if (direct) return direct;

  // Fall back to legacy membership plan ID → monthly catalog item.
  return paymentCatalog.find(
    (item) =>
      item.membershipPlanId === id &&
      item.type === "membership_monthly" &&
      item.active
  );
}
