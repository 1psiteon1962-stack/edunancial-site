import type { PaymentCatalogItem } from "@/lib/payments/catalog";
import { getNeonSql, readDatabaseUrl } from "@/lib/db/neon";

export function hasPaymentPersistenceConfig() {
  return Boolean(readDatabaseUrl());
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
  const sql = getNeonSql();
  if (!sql) throw new Error("Square payment persistence is not configured.");

  await sql`
    insert into payment_catalog_items
      (id,name,description,item_type,price,currency,is_recurring,recurring_interval,
       membership_plan_id,content_id,active,metadata)
    values
      (${input.item.id},${input.item.name},${input.item.description ?? null},${input.item.type},
       ${input.item.price},${input.item.currency.toUpperCase()},${input.item.isRecurring},
       ${input.item.recurringInterval ?? null},${input.item.membershipPlanId ?? null},
       ${input.item.contentId ?? null},${input.item.active},
       ${JSON.stringify(input.item.metadata ?? null)}::jsonb)
    on conflict (id) do update set
      name=excluded.name, description=excluded.description, item_type=excluded.item_type,
      price=excluded.price, currency=excluded.currency, is_recurring=excluded.is_recurring,
      recurring_interval=excluded.recurring_interval, membership_plan_id=excluded.membership_plan_id,
      content_id=excluded.content_id, active=excluded.active, metadata=excluded.metadata,
      updated_at=now()
  `;

  const rows = await sql`
    insert into orders
      (catalog_item_id,customer_email,status,amount_requested,currency,discount_code,
       discount_amount,square_payment_link_id,square_order_id,idempotency_key,metadata)
    values
      (${input.item.id},${input.customerEmail?.trim().toLowerCase() || null},'pending',
       ${input.amountRequested},${input.currency.toUpperCase()},${input.discountCode?.trim() || null},
       ${input.discountAmount ?? 0},${input.squarePaymentLinkId ?? null},${input.squareOrderId ?? null},
       ${input.idempotencyKey},${JSON.stringify(input.metadata ?? null)}::jsonb)
    on conflict (idempotency_key) do update set
      catalog_item_id=excluded.catalog_item_id,
      customer_email=excluded.customer_email,
      amount_requested=excluded.amount_requested,
      currency=excluded.currency,
      discount_code=excluded.discount_code,
      discount_amount=excluded.discount_amount,
      square_payment_link_id=excluded.square_payment_link_id,
      square_order_id=excluded.square_order_id,
      metadata=excluded.metadata,
      updated_at=now()
    returning id,square_order_id
  `;

  if (!rows[0]) throw new Error("Unable to persist Square checkout order: no row returned.");
  return rows[0];
}
