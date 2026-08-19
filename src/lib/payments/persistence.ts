import type { PaymentCatalogItem } from "@/lib/payments/catalog";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface PersistedOrder {
  id: string;
  catalog_item_id: string;
  customer_email: string | null;
  status: string;
  amount_requested: number;
  amount_charged: number | null;
  currency: string;
  square_payment_link_id: string | null;
  square_order_id: string | null;
  square_payment_id: string | null;
  idempotency_key: string | null;
}

export interface NormalizedSquarePayment {
  paymentId: string | null;
  orderId: string | null;
  customerId: string | null;
  status: string;
  amount: number;
  currency: string;
  customerEmail: string | null;
  raw: Record<string, unknown>;
}

function requirePersistenceConfig() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  if (!url || !serviceKey) {
    throw new Error(
      "Square payment persistence requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
}

export function hasPaymentPersistenceConfig() {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim() &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim()
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
  requirePersistenceConfig();
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
    { onConflict: "id" }
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
      { onConflict: "idempotency_key" }
    )
    .select("id,catalog_item_id,customer_email,status,amount_requested,amount_charged,currency,square_payment_link_id,square_order_id,square_payment_id,idempotency_key")
    .single();

  if (error || !data) {
    throw new Error(`Unable to persist Square checkout order: ${error?.message ?? "unknown error"}`);
  }

  return data as PersistedOrder;
}

export async function findOrderBySquareOrderId(squareOrderId: string) {
  requirePersistenceConfig();
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select("id,catalog_item_id,customer_email,status,amount_requested,amount_charged,currency,square_payment_link_id,square_order_id,square_payment_id,idempotency_key")
    .eq("square_order_id", squareOrderId)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to resolve Square order: ${error.message}`);
  }
  return (data as PersistedOrder | null) ?? null;
}

export async function recordSquarePayment(
  payment: NormalizedSquarePayment,
  order: PersistedOrder | null
) {
  requirePersistenceConfig();
  const admin = getSupabaseAdminClient();

  if (payment.paymentId) {
    const { error: transactionError } = await admin.from("payment_transactions").upsert(
      {
        order_id: order?.id ?? null,
        provider: "square",
        square_payment_id: payment.paymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status.toLowerCase(),
        raw_payload: payment.raw,
      },
      { onConflict: "square_payment_id" }
    );
    if (transactionError) {
      throw new Error(`Unable to persist Square payment: ${transactionError.message}`);
    }
  }

  if (order) {
    const completed = payment.status === "COMPLETED";
    const failed = payment.status === "FAILED" || payment.status === "CANCELED";
    const { error: orderError } = await admin
      .from("orders")
      .update({
        status: completed ? "completed" : failed ? "failed" : order.status,
        amount_charged: completed ? payment.amount : order.amount_charged,
        square_payment_id: payment.paymentId ?? order.square_payment_id,
      })
      .eq("id", order.id);
    if (orderError) {
      throw new Error(`Unable to update Square order: ${orderError.message}`);
    }
  }
}

export async function persistMembershipActivation(input: {
  email: string;
  planId: string;
  paymentId?: string | null;
  customerId?: string | null;
}) {
  requirePersistenceConfig();
  const admin = getSupabaseAdminClient();
  const email = input.email.trim().toLowerCase();
  const nextJourneyRoute = "/welcome?step=dashboard";

  const { error: memberError } = await admin.from("members").upsert(
    {
      email,
      membership_tier: input.planId,
      active: true,
      has_dashboard_access: true,
      next_journey_route: nextJourneyRoute,
      deactivated_at: null,
    },
    { onConflict: "email" }
  );
  if (memberError) {
    throw new Error(`Unable to persist member activation: ${memberError.message}`);
  }

  let existingId: string | null = null;
  if (input.paymentId) {
    const { data, error } = await admin
      .from("subscriptions")
      .select("id")
      .eq("provider_payment_id", input.paymentId)
      .maybeSingle();
    if (error) {
      throw new Error(`Unable to resolve membership record: ${error.message}`);
    }
    existingId = typeof data?.id === "string" ? data.id : null;
  }

  const subscriptionRecord = {
    member_email: email,
    plan_id: input.planId,
    status: "active",
    provider: "square",
    provider_customer_id: input.customerId ?? null,
    provider_payment_id: input.paymentId ?? null,
    current_period_start: new Date().toISOString(),
  };

  const operation = existingId
    ? admin.from("subscriptions").update(subscriptionRecord).eq("id", existingId)
    : admin.from("subscriptions").insert(subscriptionRecord);
  const { error: subscriptionError } = await operation;
  if (subscriptionError) {
    throw new Error(`Unable to persist membership lifecycle: ${subscriptionError.message}`);
  }

  return { nextJourneyRoute };
}

export async function claimPersistentWebhookEvent(input: {
  eventId: string;
  eventType: string;
  rawPayload: Record<string, unknown>;
}) {
  requirePersistenceConfig();
  const admin = getSupabaseAdminClient();
  const { error } = await admin.from("webhook_events").insert({
    event_id: input.eventId,
    event_type: input.eventType,
    provider: "square",
    processed: false,
    duplicate: false,
    raw_payload: input.rawPayload,
  });

  if (!error) return true;
  if (error.code === "23505") return false;
  throw new Error(`Unable to claim Square webhook event: ${error.message}`);
}

export async function markPersistentWebhookEventProcessed(eventId: string) {
  requirePersistenceConfig();
  const admin = getSupabaseAdminClient();
  const { error } = await admin
    .from("webhook_events")
    .update({ processed: true, processed_at: new Date().toISOString() })
    .eq("event_id", eventId);
  if (error) {
    throw new Error(`Unable to finalize Square webhook event: ${error.message}`);
  }
}

export async function releasePersistentWebhookEvent(eventId: string) {
  if (!hasPaymentPersistenceConfig()) return;
  const admin = getSupabaseAdminClient();
  await admin.from("webhook_events").delete().eq("event_id", eventId).eq("processed", false);
}
