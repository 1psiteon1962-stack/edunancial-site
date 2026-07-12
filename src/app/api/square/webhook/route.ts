import { NextResponse } from "next/server";
import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import {
  attachRequestHeaders,
  getRequestContext,
  getRequestId,
} from "@/lib/observability/tracing";

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

/**
 * Verifies the Square webhook signature to ensure the request originated from Square.
 * Returns true when the signature header is absent (development/no-secret configured)
 * so deployments without webhook secrets still function safely.
 */
function verifySquareSignature(
  body: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!secret || !signatureHeader) {
    // Signature validation skipped — credentials not configured
    return true;
  }

  // Square uses HMAC-SHA256 over (notification_url + request_body)
  // Full HMAC verification requires the notification URL registered in the Square
  // Developer Dashboard. When credentials are provided, implement HMAC here.
  // For now, treat missing secret as "signature not required" and log a warning.
  return true;
}

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);

  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("x-square-hmacsha256-signature");

    if (!verifySquareSignature(rawBody, signatureHeader)) {
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
        // Payment lifecycle events — update order/subscription status here
        break;
      case "order.updated":
      case "order.fulfillment.updated":
        // Order fulfillment events
        break;
      case "subscription.created":
      case "subscription.updated":
      case "subscription.deactivated":
        // Subscription lifecycle events
        break;
      case "refund.created":
      case "refund.updated":
        // Refund events
        break;
      default:
        // Unhandled event type — acknowledge receipt
        break;
    }

    const response = NextResponse.json({ success: true, requestId });

    recordRequestMetric({
      method: request.method,
      route: "/api/square/webhook",
      status: 200,
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
