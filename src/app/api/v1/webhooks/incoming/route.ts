/**
 * POST /api/v1/webhooks/incoming
 *
 * Generic incoming webhook endpoint.
 * Validates signature, checks for replay, and routes to the appropriate handler.
 *
 * Provider-specific endpoints (e.g. /api/v1/webhooks/incoming/stripe) should
 * reuse the primitives from @/lib/webhooks.
 *
 * Expected headers:
 *   X-Webhook-Signature  – t=<timestamp>,v1=<hmac>
 *   X-Webhook-Provider   – (optional) identifies the source provider
 */

import { handleError, ApiError } from "@/lib/api/errors";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/lib/api/rate-limit";
import { success } from "@/lib/api/response";
import { validateWebhookSignature, extractRawBody } from "@/lib/webhooks/validator";
import { checkAndMarkReplay } from "@/lib/webhooks/replay";
import type { WebhookPayload } from "@/lib/webhooks/events";
import { audit } from "@/lib/monitoring/audit";
import { logger } from "@/lib/monitoring/logger";

export const runtime = "edge";

// The shared incoming webhook secret. Per-provider secrets should be validated
// before reaching this route in production (use separate sub-routes per provider).
function getWebhookSecret(): string {
  return process.env.WEBHOOK_INCOMING_SECRET ?? "dev-insecure-webhook-secret";
}

export async function POST(request: Request) {
  try {
    await enforceRateLimit(request, { ...RATE_LIMIT_PRESETS.webhooks, keyPrefix: "webhook.in" });

    const rawBody = await extractRawBody(request);
    const signatureHeader = request.headers.get("x-webhook-signature");

    await validateWebhookSignature(rawBody, signatureHeader, {
      secret: getWebhookSecret(),
      toleranceSeconds: 300,
    });

    let payload: WebhookPayload;
    try {
      payload = JSON.parse(rawBody) as WebhookPayload;
    } catch {
      throw new ApiError("VALIDATION_ERROR" as never, "Webhook payload is not valid JSON", 400);
    }

    if (!payload.id || !payload.type) {
      throw new ApiError("VALIDATION_ERROR" as never, "Webhook payload missing id or type", 400);
    }

    // Replay protection
    const isReplay = await checkAndMarkReplay(payload.id);
    if (isReplay) {
      logger.warn("webhook.replay_detected", { eventId: payload.id, type: payload.type });
      // Return 200 to prevent the sender from retrying
      return success({ received: true, note: "duplicate" });
    }

    audit("webhook.received", {
      actorType: "system",
      result: "success",
      metadata: { eventId: payload.id, type: payload.type },
    });

    logger.info("webhook.received", { eventId: payload.id, type: payload.type });

    // TODO: Route to domain handlers based on payload.type
    // e.g. if (payload.type === "payment.succeeded") { await handlePaymentSucceeded(payload.data); }

    return success({ received: true });
  } catch (err) {
    return handleError(err);
  }
}
