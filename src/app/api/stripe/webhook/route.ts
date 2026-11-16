/** Stripe webhook: verified, idempotent membership fulfillment for Stripe Checkout payments. OFF by default. */
import { NextResponse } from "next/server";

import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";
import { enforcePaymentRateLimit } from "@/lib/payments/rateLimiter";
import { isStripeCheckoutEnabled, verifyStripeWebhookSignature } from "@/lib/payments/stripe";
import { fulfillStripeCheckoutSession, type StripeEvent, type StripeFulfillmentOutcome } from "@/lib/payments/stripeFulfillment";
import { claimWebhookEvent, markWebhookEventProcessed } from "@/lib/payments/webhookIdempotency";

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);
  const route = "/api/stripe/webhook";
  const respond = (body: Record<string, unknown>, status: number) => {
    recordRequestMetric({ method: request.method, route, status, durationMs: Date.now() - start });
    return attachRequestHeaders(NextResponse.json({ ...body, requestId }, { status }), requestId);
  };
  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const rateLimit = enforcePaymentRateLimit({ scope: "stripe-webhook", key: ipAddress, maxRequests: 120, windowMs: 60000 });
    if (!rateLimit.allowed) return respond({ success: false, error: "Webhook rate limit exceeded" }, 429);

    const rawBody = await request.text();
    if (!isStripeCheckoutEnabled()) return respond({ success: false, error: "Stripe checkout is not enabled." }, 503);
    if (!verifyStripeWebhookSignature(rawBody, request.headers.get("stripe-signature"))) {
      return respond({ success: false, error: "Invalid signature" }, 401);
    }

    const event = JSON.parse(rawBody) as StripeEvent;
    const eventId = event.id ?? "";
    const eventType = event.type ?? "unknown";
    if (!eventId) return respond({ success: false, error: "Verified webhook is missing id" }, 400);

    const claimed = await claimWebhookEvent(`stripe:${eventId}`, eventType, event);
    if (!claimed) return respond({ success: true, processed: false, duplicate: true, eventType }, 202);

    let outcome: StripeFulfillmentOutcome = { fulfilled: false, reason: "ignored-event" };
    if (eventType === "checkout.session.completed" || eventType === "checkout.session.async_payment_succeeded") {
      outcome = await fulfillStripeCheckoutSession(event.data?.object ?? {});
    }
    await markWebhookEventProcessed(`stripe:${eventId}`);
    return respond({ success: true, processed: outcome.fulfilled, eventType, ...(outcome.fulfilled ? {} : { reason: outcome.reason }) }, 200);
  } catch (error) {
    logStructuredError(error, { ...getRequestContext(request, requestId), route });
    return respond({ success: false, error: "Webhook processing failed." }, 500);
  }
}
