import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface MarketplacePaymentInput {
  status?: string;
  order_id?: string;
  id?: string;
  buyer_email_address?: string;
}

/** Grant Marketplace access only from a verified COMPLETED Square payment. */
export async function fulfillSquareMarketplacePayment(payment: MarketplacePaymentInput): Promise<boolean> {
  if (payment.status?.toUpperCase() !== "COMPLETED" || !payment.order_id) return false;

  const admin = getSupabaseAdminClient();
  const { data: order, error: orderError } = await admin
    .from("orders")
    .select("id,catalog_item_id,customer_email,square_order_id,metadata")
    .eq("square_order_id", payment.order_id)
    .maybeSingle();
  if (orderError || !order) return false;

  const catalogItemId = String(order.catalog_item_id ?? "");
  if (!catalogItemId.startsWith("marketplace:")) return false;
  const productId = catalogItemId.slice("marketplace:".length);
  if (!productId) return false;

  const purchaserEmail = String(order.customer_email ?? payment.buyer_email_address ?? "").trim().toLowerCase();
  if (!purchaserEmail) return false;

  const { error: entitlementError } = await admin.from("marketplace_entitlements").upsert(
    {
      product_id: productId,
      purchaser_email: purchaserEmail,
      order_id: order.id,
      square_order_id: payment.order_id,
      square_payment_id: payment.id ?? null,
      status: "active",
      revoked_at: null,
      metadata: { source: "verified_square_webhook" },
    },
    { onConflict: "product_id,purchaser_email" },
  );
  if (entitlementError) throw new Error(`Unable to grant Marketplace entitlement: ${entitlementError.message}`);

  const { error: updateError } = await admin.from("orders").update({
    status: "completed",
    square_payment_id: payment.id ?? null,
  }).eq("id", order.id);
  if (updateError) throw new Error(`Unable to complete Marketplace order: ${updateError.message}`);

  return true;
}
