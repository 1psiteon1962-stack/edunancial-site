import { applyAuthoritativeMembershipEntitlement } from "@/lib/member/entitlements";
import { getLocalizedCatalogPrice } from "@/lib/location/pricing";
import { resolveCatalogItem } from "@/lib/payments/catalog";
import { STRIPE_CHECKOUT_COUNTRIES, toStripeMinorUnits } from "@/lib/payments/stripe";

export interface StripeCheckoutSessionObject {
  id?: string;
  payment_status?: string;
  status?: string;
  amount_total?: number;
  currency?: string;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  metadata?: Record<string, string> | null;
}

export interface StripeEvent {
  id?: string;
  type?: string;
  data?: { object?: StripeCheckoutSessionObject };
}

export type StripeFulfillmentOutcome =
  | { fulfilled: true; email: string; planId: string }
  | { fulfilled: false; reason: string };

/** Grant membership only when the paid amount and currency equal the approved local price. */
export async function fulfillStripeCheckoutSession(session: StripeCheckoutSessionObject): Promise<StripeFulfillmentOutcome> {
  if (session.payment_status !== "paid") return { fulfilled: false, reason: "not-paid" };
  const metadata = session.metadata ?? {};
  const email = (session.customer_details?.email ?? session.customer_email ?? "").trim();
  const planId = metadata.membership_plan_id?.trim();
  const itemId = metadata.catalog_item_id?.trim();
  const countryCode = metadata.country_code?.trim().toUpperCase();
  if (!email || !planId || !itemId || !countryCode) return { fulfilled: false, reason: "missing-metadata" };

  const item = resolveCatalogItem(itemId);
  const expectedCurrency = STRIPE_CHECKOUT_COUNTRIES[countryCode];
  const localized = item ? getLocalizedCatalogPrice(item.id, countryCode) : null;
  if (!item || item.membershipPlanId !== planId || !expectedCurrency || !localized) return { fulfilled: false, reason: "unknown-item" };

  const paidCurrency = (session.currency ?? "").toUpperCase();
  const expectedMinor = toStripeMinorUnits(localized.amount, localized.currency);
  if (paidCurrency !== expectedCurrency || session.amount_total !== expectedMinor) {
    return { fulfilled: false, reason: "amount-mismatch" };
  }

  await applyAuthoritativeMembershipEntitlement({ email, planId });
  return { fulfilled: true, email, planId };
}

