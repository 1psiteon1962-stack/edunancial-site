import type { PaymentCatalogItem } from "@/lib/payments/catalog";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export function hasPaymentPersistenceConfig() {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim() &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim(),
  );
}

export async function persistCheckoutInitiation(input: {
  item: PaymentCatalogItem;
  customerEmail?: string;
  amountRequested: number;
  currency: string;
  discountCode?: string;
  discountAmount?: number;
  squarePaymentLinkId?: string;
  squareOrderId?: string;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}) {
  if (!hasPaymentPersistenceConfig()) {
    throw new Error("Square payment persistence is not configured.");
  }

  const admin = getSupabaseAdminClient();
  const { error: catalogError } = await admin.from("payment_catalog_items").upsert(
    {
      id: input.item.id,
      name: input.item.name,
      description: input.item.description,
      item_type: input.item.type,
      price: input.item.price,
      currency: input.item.currency.toUpperCase(),
      is_recurring: input.item.isRecurring,
      recurring_interval: input.item.recurringInterval ?? null,
      membership_plan_id: input.item.membershipPlanId ?? null,
      content_id: input.item.contentId ?? null,
      active: input.item.active,
      metadata: input.item.metadata ?? null,
    },
    { onConflict: "id" },
  );
  if (catalogError) {
    throw new Error(`Unable to persist Square catalog item: ${catalogError.message}`);
  }

  const { data, error } = await admin
    .from("orders")
    .upsert(
      {
        catalog_item_id: input.item.id,
        customer_email: input.customerEmail?.trim().toLowerCase() || null,
        status: "pending",
        amount_requested: input.amountRequested,
        currency: input.currency.toUpperCase(),
        discount_code: input.discountCode?.trim() || null,
        discount_amount: input.discountAmount ?? 0,
        square_payment_link_id: input.squarePaymentLinkId ?? null,
        square_order_id: input.squareOrderId ?? null,
        idempotency_key: input.idempotencyKey,
        metadata: input.metadata ?? null,
      },
      { onConflict: "idempotency_key" },
    )
    .select("id,square_order_id")
    .single();

  if (error || !data) {
    throw new Error(`Unable to persist Square checkout order: ${error?.message ?? "unknown error"}`);
  }

  return data;
}
