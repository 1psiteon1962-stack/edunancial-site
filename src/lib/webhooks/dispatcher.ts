/**
 * Outgoing webhook dispatcher.
 * Sends signed webhook payloads to registered subscriber URLs.
 *
 * Features:
 *   - HMAC-SHA256 payload signing
 *   - Retry with exponential back-off (3 attempts)
 *   - Per-subscription delivery logging
 */

import type { WebhookPayload, WebhookEventType, WebhookSubscription } from "./events";
import { buildWebhookSignatureHeader } from "./validator";

// ─── Subscription registry ────────────────────────────────────────────────────

const subscriptions = new Map<string, WebhookSubscription>();

export function registerWebhookSubscription(sub: WebhookSubscription): void {
  subscriptions.set(sub.id, sub);
}

export function removeWebhookSubscription(id: string): void {
  subscriptions.delete(id);
}

export function listWebhookSubscriptions(): WebhookSubscription[] {
  return [...subscriptions.values()].filter((s) => s.enabled);
}

function generateEventId(): string {
  return `evt_${Date.now()}_${Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;
}

// ─── Delivery ─────────────────────────────────────────────────────────────────

interface DeliveryResult {
  subscriptionId: string;
  status: "delivered" | "failed";
  statusCode?: number;
  attempts: number;
  error?: string;
}

async function deliverWithRetry(
  sub: WebhookSubscription,
  body: string,
  signature: string,
  maxAttempts = 3
): Promise<DeliveryResult> {
  let attempt = 0;
  let lastError = "";

  while (attempt < maxAttempts) {
    attempt++;
    try {
      const res = await fetch(sub.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Attempt": String(attempt),
        },
        body,
        signal: AbortSignal.timeout(10_000),
      });

      if (res.ok) {
        return { subscriptionId: sub.id, status: "delivered", statusCode: res.status, attempts: attempt };
      }

      lastError = `HTTP ${res.status}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }

    // Exponential back-off: 1s, 2s, 4s
    if (attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt - 1) * 1000));
    }
  }

  return { subscriptionId: sub.id, status: "failed", attempts: attempt, error: lastError };
}

// ─── Public dispatcher ────────────────────────────────────────────────────────

/**
 * Dispatch a webhook event to all matching active subscriptions.
 */
export async function dispatchWebhookEvent<T>(
  eventType: WebhookEventType,
  data: T,
  options: { apiVersion?: string } = {}
): Promise<DeliveryResult[]> {
  const payload: WebhookPayload<T> = {
    id: generateEventId(),
    timestamp: new Date().toISOString(),
    type: eventType,
    data,
    apiVersion: options.apiVersion ?? "1",
  };

  const body = JSON.stringify(payload);
  const matching = listWebhookSubscriptions().filter((s) =>
    s.events.includes(eventType) || s.events.includes("*" as WebhookEventType)
  );

  const results = await Promise.all(
    matching.map(async (sub) => {
      const signature = await buildWebhookSignatureHeader(body, sub.secret);
      return deliverWithRetry(sub, body, signature);
    })
  );

  return results;
}
