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

    switch (eventType) {
      case "payment.completed":
      case "payment.updated":
      case "order.updated":
      case "order.fulfillment.updated":
      case "subscription.created":
      case "subscription.updated":
      case "subscription.deactivated":
      case "refund.created":
      case "refund.updated":
      default:
        break;
    }

    const response = NextResponse.json(
      {
        success: true,
        processed: false,
        eventType,
        message:
          "Event signature verified. Automated fulfillment remains disabled until membership lifecycle handlers are implemented.",
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
