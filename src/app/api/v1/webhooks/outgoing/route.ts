/**
 * POST /api/v1/webhooks/outgoing
 *
 * Trigger dispatch of a webhook event to registered subscribers.
 * Requires authenticated request with admin role or webhooks:write scope.
 */

import { handleError } from "@/lib/api/errors";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/lib/api/rate-limit";
import { success } from "@/lib/api/response";
import { parseAndValidate } from "@/lib/api/validation";
import { requireJwt } from "@/lib/auth/jwt";
import { requireRoleOrScope } from "@/lib/auth/rbac";
import { dispatchWebhookEvent } from "@/lib/webhooks/dispatcher";
import type { WebhookEventType } from "@/lib/webhooks/events";
import { audit } from "@/lib/monitoring/audit";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    await enforceRateLimit(request, { ...RATE_LIMIT_PRESETS.api, keyPrefix: "webhook.out" });

    const claims = await requireJwt(request);
    requireRoleOrScope(claims, "admin", "webhooks:write");

    const body = await parseAndValidate<{ type: string; data: unknown }>(request, {
      type: { required: true, type: "string" },
      data: { required: true },
    });

    const results = await dispatchWebhookEvent(
      body.type as WebhookEventType,
      body.data,
      { apiVersion: "1" }
    );

    const delivered = results.filter((r) => r.status === "delivered").length;
    const failed = results.filter((r) => r.status === "failed").length;

    audit("webhook.delivered", {
      actorId: claims.sub,
      actorType: "user",
      result: delivered > 0 ? "success" : "failure",
      metadata: { eventType: body.type, delivered, failed },
    });

    return success({ dispatched: results.length, delivered, failed, results });
  } catch (err) {
    return handleError(err);
  }
}
