import { NextResponse } from "next/server";

import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import {
  attachRequestHeaders,
  getRequestContext,
  getRequestId,
} from "@/lib/observability/tracing";
import {
  isSquareVerifiedCheckoutEnabled,
  verifySquareWebhookSignature,
} from "@/lib/square";
import { processSquareLifecycleEvent } from "@/lib/payments/membershipLifecycle";
import { enforcePaymentRateLimit } from "@/lib/payments/rateLimiter";

interface SquareWebhookEvent {
  merchant_id?: string;
  type?: string;
  event_id?: string;
  created_at?: string;
  data?: {
    type?: string;
    id?: string;
    object?: Record<string, unknown>;
  };
}

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);

  try {
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimit = enforcePaymentRateLimit({
      scope: "square-webhook",
      key: ipAddress,
      maxRequests: 120,
      windowMs: 60_000,
    });

    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { success: false, error: "Webhook rate limit exceeded", requestId },
        { status: 429 }
      );
      response.headers.set(
        "Retry-After",
        Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString()
      );

      recordRequestMetric({
        method: request.method,
        route: "/api/square/webhook",
        status: 429,
        durationMs: Date.now() - start,
      });

      return attachRequestHeaders(response, requestId);
    }

    const rawBody = await request.text();
    const signatureHeader = request.headers.get("x-square-hmacsha256-signature");

    if (!isSquareVerifiedCheckoutEnabled()) {
      const response = NextResponse.json(
        {
          success: false,
          error:
            "Square webhook processing is disabled until verified checkout is explicitly enabled.",
          requestId,
        },
        { status: 503 }
      );

      recordRequestMetric({
        method: request.method,
        route: "/api/square/webhook",
        status: 503,
        durationMs: Date.now() - start,
      });

      return attachRequestHeaders(response, requestId);
    }

    if (!verifySquareWebhookSignature(rawBody, signatureHeader)) {
      const response = NextResponse.json(
        { success: false, error: "Invalid signature", requestId },
        { status: 401 }
      );

      recordRequestMetric({
        method: request.method,
        route: "/api/square/webhook",
        status: 401,
        durationMs: Date.now() - start,
      });

      return attachRequestHeaders(response, requestId);
    }

    const event = JSON.parse(rawBody) as SquareWebhookEvent;
    const eventType = event.type ?? "unknown";
    const lifecycle = processSquareLifecycleEvent(event);

    const response = NextResponse.json(
      {
        success: true,
        processed: lifecycle.processed,
        eventType,
        subscriptionId: lifecycle.subscriptionId,
        membershipStatus: lifecycle.status,
        nextRoute: lifecycle.nextJourneyRoute,
        message: lifecycle.processed
          ? "Webhook processed and membership lifecycle synchronized."
          : "Event signature verified; no membership lifecycle state change required.",
        requestId,
      },
      { status: 202 }
    );

    recordRequestMetric({
      method: request.method,
      route: "/api/square/webhook",
      status: 202,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  } catch (error) {
    logStructuredError(error, {
      ...getRequestContext(request, requestId),
      route: "/api/square/webhook",
    });

    const response = NextResponse.json(
      { success: false, error: "Webhook processing failed", requestId },
      { status: 500 }
    );

    recordRequestMetric({
      method: request.method,
      route: "/api/square/webhook",
      status: 500,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  }
}
