/**
 * Unified Payment Catalog
 *
 * Every purchasable item on the Edunancial platform is represented as a
 * PaymentCatalogItem. New product types are added here via configuration
 * rather than new payment code paths.
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
  id: string;
  name: string;
  description: string;
  type: CatalogItemType;
  price: number;
  currency: string;
  isRecurring: boolean;
  recurringInterval?: "monthly" | "annual";
  membershipPlanId?: string;
  contentId?: string;
  active: boolean;
  metadata?: Record<string, string>;
}

export const paymentCatalog: PaymentCatalogItem[] = [
  {
    id: "membership-basic-monthly",
    name: "Basic Membership — Monthly",
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
    name: "Basic Membership — Annual",
    description:
      "Full-year Basic access at the annual price disclosed at checkout.",
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
];

export function getCatalogItem(id: string): PaymentCatalogItem | undefined {
  return paymentCatalog.find((item) => item.id === id);
}

export function getActiveCatalogItems(
  type?: CatalogItemType
): PaymentCatalogItem[] {
  const active = paymentCatalog.filter((item) => item.active);
  return type ? active.filter((item) => item.type === type) : active;
}

export function resolveCatalogItem(
  id: string
): PaymentCatalogItem | undefined {
  const direct = getCatalogItem(id);
  if (direct) return direct;

  return paymentCatalog.find(
    (item) =>
      item.membershipPlanId === id &&
      item.type === "membership_monthly" &&
      item.active
  );
}
