import { NextResponse } from "next/server";

import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";
import { applyAuthoritativeMembershipEntitlement } from "@/lib/member/entitlements";
import { isSquareVerifiedCheckoutEnabled, verifyManagedSquareWebhookSignature } from "@/lib/square";
import { enforcePaymentRateLimit } from "@/lib/payments/rateLimiter";
import { resolveCatalogItem } from "@/lib/payments/catalog";
import {
  claimPersistentWebhookEvent,
  findOrderBySquareOrderId,
  hasPaymentPersistenceConfig,
  markPersistentWebhookEventProcessed,
  persistMembershipActivation,
  recordSquarePayment,
  releasePersistentWebhookEvent,
  type NormalizedSquarePayment,
} from "@/lib/payments/persistence";

interface SquareWebhookEvent {
  merchant_id?: string;
  type?: string;
  event_id?: string;
  created_at?: string;
  data?: { type?: string; id?: string; object?: Record<string, unknown> };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizePayment(eventObject: Record<string, unknown>): NormalizedSquarePayment | null {
  const payment = asRecord(eventObject.payment) ?? eventObject;
  const amountMoney = asRecord(payment.amount_money);
  const amountMinor = typeof amountMoney?.amount === "number"
    ? amountMoney.amount
    : typeof amountMoney?.amount === "string"
      ? Number(amountMoney.amount)
      : 0;

  const paymentId = stringValue(payment.id) ?? stringValue(eventObject.id);
  const orderId = stringValue(payment.order_id);
  const status = (stringValue(payment.status) ?? "UNKNOWN").toUpperCase();
  const currency = (stringValue(amountMoney?.currency) ?? "USD").toUpperCase();
  const customerEmail =
    stringValue(payment.buyer_email_address) ??
    stringValue(payment.customer_email) ??
    stringValue(eventObject.customer_email) ??
    stringValue(eventObject.email_address);

  if (!paymentId && !orderId) return null;

  return {
    paymentId,
    orderId,
    customerId: stringValue(payment.customer_id),
    status,
    amount: Number.isFinite(amountMinor) ? amountMinor / 100 : 0,
    currency,
    customerEmail,
    raw: payment,
  };
}

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);
  const route = "/api/square/webhook";
  let claimedEventId = "";

  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const rateLimit = enforcePaymentRateLimit({ scope: "square-webhook", key: ipAddress, maxRequests: 120, windowMs: 60_000 });
    if (!rateLimit.allowed) {
      const response = NextResponse.json({ success: false, error: "Webhook rate limit exceeded", requestId }, { status: 429 });
      response.headers.set("Retry-After", Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString());
      recordRequestMetric({ method: request.method, route, status: 429, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    const rawBody = await request.text();
    const signatureHeader = request.headers.get("x-square-hmacsha256-signature");

    if (!isSquareVerifiedCheckoutEnabled() || !hasPaymentPersistenceConfig()) {
      const response = NextResponse.json({ success: false, error: "Square production payment processing is not fully configured.", requestId }, { status: 503 });
      recordRequestMetric({ method: request.method, route, status: 503, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    if (!(await verifyManagedSquareWebhookSignature(rawBody, signatureHeader))) {
      const response = NextResponse.json({ success: false, error: "Invalid signature", requestId }, { status: 401 });
      recordRequestMetric({ method: request.method, route, status: 401, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    const event = JSON.parse(rawBody) as SquareWebhookEvent;
    const eventType = event.type ?? "unknown";
    const eventId = event.event_id ?? "";

    if (!eventId) {
      return attachRequestHeaders(NextResponse.json({ success: false, error: "Square event_id is required.", requestId }, { status: 400 }), requestId);
    }

    const claimed = await claimPersistentWebhookEvent({
      eventId,
      eventType,
      rawPayload: event as unknown as Record<string, unknown>,
    });
    if (!claimed) {
      const response = NextResponse.json({ success: true, processed: false, duplicate: true, eventType, message: "Duplicate event ignored.", requestId }, { status: 202 });
      recordRequestMetric({ method: request.method, route, status: 202, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }
    claimedEventId = eventId;

    const eventObject = event.data?.object ?? {};
    const payment = eventType === "payment.created" || eventType === "payment.updated"
      ? normalizePayment(eventObject)
      : null;

    let processed = false;
    let membershipStatus: string | undefined;
    let nextRoute: string | undefined;

    if (payment) {
      const order = payment.orderId ? await findOrderBySquareOrderId(payment.orderId) : null;
      await recordSquarePayment(payment, order);

      if (payment.status === "COMPLETED" && order) {
        const item = resolveCatalogItem(order.catalog_item_id);
        if (item?.membershipPlanId) {
          const email = order.customer_email ?? payment.customerEmail;
          if (!email) {
            throw new Error("Completed membership payment has no authoritative customer email.");
          }

          const activation = await persistMembershipActivation({
            email,
            planId: item.membershipPlanId,
            paymentId: payment.paymentId,
            customerId: payment.customerId,
          });
          await applyAuthoritativeMembershipEntitlement({
            email,
            planId: item.membershipPlanId,
          });
          processed = true;
          membershipStatus = "active";
          nextRoute = activation.nextJourneyRoute;
        } else {
          processed = payment.status === "COMPLETED";
        }
      }
    }

    await markPersistentWebhookEventProcessed(eventId);
    claimedEventId = "";

    const response = NextResponse.json({
      success: true,
      processed,
      eventType,
      membershipStatus,
      nextRoute,
      message: processed ? "Webhook processed and persisted." : "Event signature verified and persisted; no entitlement change required.",
      requestId,
    }, { status: 202 });
    recordRequestMetric({ method: request.method, route, status: 202, durationMs: Date.now() - start });
    return attachRequestHeaders(response, requestId);
  } catch (error) {
    if (claimedEventId) {
      await releasePersistentWebhookEvent(claimedEventId).catch(() => undefined);
    }
    logStructuredError(error, { ...getRequestContext(request, requestId), route });
    const response = NextResponse.json({ success: false, error: "Webhook processing failed", requestId }, { status: 500 });
    recordRequestMetric({ method: request.method, route, status: 500, durationMs: Date.now() - start });
    return attachRequestHeaders(response, requestId);
  }
}
