import { NextResponse } from "next/server";

import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";
import { applyAuthoritativeMembershipEntitlement } from "@/lib/member/entitlements";
import { isSquareVerifiedCheckoutEnabled, verifyManagedSquareWebhookSignature } from "@/lib/square";
import { processSquareLifecycleEvent } from "@/lib/payments/membershipLifecycle";
import { enforcePaymentRateLimit } from "@/lib/payments/rateLimiter";
import { claimWebhookEvent, markWebhookEventProcessed } from "@/lib/payments/webhookIdempotency";
import { recordPaymentTaxLedgerEntry } from "@/lib/tax/payment-ledger";

interface SquareWebhookEvent {
  merchant_id?: string;
  type?: string;
  event_id?: string;
  created_at?: string;
  data?: { type?: string; id?: string; object?: Record<string, unknown> };
}

interface SquareMoney { amount?: number; currency?: string; }
interface SquarePayment {
  id?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  total_money?: SquareMoney;
  amount_money?: SquareMoney;
  tip_money?: SquareMoney;
  refunded_money?: SquareMoney;
  processing_fee?: Array<{ amount_money?: SquareMoney }>;
  order_id?: string;
  note?: string;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function extractPayment(eventObject: Record<string, unknown>): SquarePayment | null {
  const direct = asRecord(eventObject.payment);
  const nested = asRecord(asRecord(eventObject.object)?.payment);
  const candidate = direct ?? nested ?? (typeof eventObject.id === "string" ? eventObject : null);
  return candidate as SquarePayment | null;
}

function extractMetadata(eventObject: Record<string, unknown>): Record<string, unknown> {
  const direct = asRecord(eventObject.metadata);
  const payment = asRecord(eventObject.payment);
  const paymentMetadata = payment ? asRecord(payment.metadata) : null;
  return direct ?? paymentMetadata ?? {};
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function integerMoney(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

async function persistVerifiedPaymentTax(event: SquareWebhookEvent, eventObject: Record<string, unknown>) {
  if (event.type !== "payment.updated" && event.type !== "payment.completed") return;
  const payment = extractPayment(eventObject);
  if (!payment || payment.status?.toUpperCase() !== "COMPLETED" || !payment.id) return;

  const metadata = extractMetadata(eventObject);
  const countryCode = stringValue(metadata.country_code);
  if (!countryCode) return;

  const taxCollectedMinor = integerMoney(metadata.tax_collected_minor);
  if (taxCollectedMinor === null) return;

  const currency = stringValue(payment.total_money?.currency)
    ?? stringValue(payment.amount_money?.currency)
    ?? stringValue(metadata.currency);
  if (!currency) return;

  await recordPaymentTaxLedgerEntry({
    sourceReference: payment.id,
    countryCode,
    jurisdictionCode: stringValue(metadata.tax_jurisdiction_code),
    currency,
    taxCollectedMinor,
    transactionAt: payment.updated_at ?? payment.created_at ?? event.created_at,
    ruleVersion: stringValue(metadata.tax_rule_version),
    registrationAccountRef: stringValue(metadata.tax_registration_account_ref),
    notes: `Verified Square ${event.type}; order=${payment.order_id ?? "unknown"}`,
  });
}

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);
  const route = "/api/square/webhook";

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

    if (!isSquareVerifiedCheckoutEnabled()) {
      const response = NextResponse.json({ success: false, error: "Square production credentials are not fully configured.", requestId }, { status: 503 });
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

    // Square event IDs are required for durable exactly-once processing. An
    // event without one cannot safely mutate payment or membership state.
    if (!eventId) {
      const response = NextResponse.json({ success: false, error: "Verified webhook is missing event_id", requestId }, { status: 400 });
      recordRequestMetric({ method: request.method, route, status: 400, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    const claimed = await claimWebhookEvent(eventId, eventType, event);
    if (!claimed) {
      const response = NextResponse.json({ success: true, processed: false, duplicate: true, eventType, message: "Duplicate event ignored.", requestId }, { status: 202 });
      recordRequestMetric({ method: request.method, route, status: 202, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    const lifecycle = processSquareLifecycleEvent(event);
    const eventObject = event.data?.object ?? {};
    await persistVerifiedPaymentTax(event, eventObject);

    const customerEmail =
      typeof eventObject.customer_email === "string"
        ? eventObject.customer_email
        : typeof eventObject.email_address === "string"
          ? eventObject.email_address
          : null;
    const membershipPlanId =
      typeof eventObject.plan_id === "string"
        ? eventObject.plan_id
        : typeof eventObject.membership_plan_id === "string"
          ? eventObject.membership_plan_id
          : null;

    if (eventType === "payment.completed" && customerEmail && membershipPlanId) {
      await applyAuthoritativeMembershipEntitlement({ email: customerEmail, planId: membershipPlanId });
    }

    await markWebhookEventProcessed(eventId);

    const response = NextResponse.json({
      success: true,
      processed: lifecycle.processed,
      eventType,
      subscriptionId: lifecycle.subscriptionId,
      membershipStatus: lifecycle.status,
      nextRoute: lifecycle.nextJourneyRoute,
      message: lifecycle.processed ? "Webhook processed and membership lifecycle synchronized." : "Event signature verified; no membership lifecycle state change required.",
      requestId,
    }, { status: 202 });
    recordRequestMetric({ method: request.method, route, status: 202, durationMs: Date.now() - start });
    return attachRequestHeaders(response, requestId);
  } catch (error) {
    logStructuredError(error, { ...getRequestContext(request, requestId), route });
    const response = NextResponse.json({ success: false, error: "Webhook processing failed", requestId }, { status: 500 });
    recordRequestMetric({ method: request.method, route, status: 500, durationMs: Date.now() - start });
    return attachRequestHeaders(response, requestId);
  }
}
