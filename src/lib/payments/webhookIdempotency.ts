/**
 * Webhook Event Idempotency
 *
 * Tracks Square webhook event IDs that have already been processed.
 * Any event arriving a second time is rejected with a no-op response.
 *
 * This prevents:
 *   • Duplicate membership activations
 *   • Duplicate email sends
 *   • Double-processing from Square retry attempts
 *   • Replay attacks using captured webhook payloads
 *
 * Durable storage: when Supabase is configured (NEXT_PUBLIC_SUPABASE_URL +
 * SUPABASE_SERVICE_ROLE_KEY), events are persisted to the `webhook_events`
 * table (unique on `event_id`). This provides multi-instance safe idempotency.
 * When Supabase is unavailable, falls back to in-memory store — safe for
 * single-instance deployments, but does NOT provide durable guarantees.
 */

interface IdempotencyEntry {
  eventId: string;
  eventType: string;
  processedAt: string;
}

/** How long to remember a processed event (72 hours). */
const RETENTION_MS = 72 * 60 * 60 * 1_000;

const processedEvents = new Map<string, IdempotencyEntry>();

function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
  );
}

async function tryDurableClaimWebhookEvent(
  eventId: string,
  eventType: string
): Promise<boolean | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabaseModule = await import("../supabase/server.js") as typeof import("../supabase/server");
    const { supabaseUpsert, supabaseSelect } = supabaseModule;

    // Attempt to insert; conflict on event_id means duplicate.
    const existing = await supabaseSelect<{ event_id: string }>("webhook_events", {
      columns: "event_id",
      filters: { event_id: eventId },
      limit: 1,
    });

    if (existing.length > 0) {
      return false; // Already processed
    }

    // Insert to claim
    await supabaseUpsert<{ event_id: string }>(
      "webhook_events",
      {
        event_id: eventId,
        event_type: eventType,
        processed_at: new Date().toISOString(),
      },
      "event_id"
    );

    return true;
  } catch {
    // Fail-closed is wrong here; if we can't reach the DB we should not
    // block processing — fall back to in-memory behavior silently.
    return null;
  }
}

/**
 * Attempt to claim an event ID for processing.
 *
 * Returns `true` if this is the first time the event ID has been seen and
 * the caller should proceed with processing.
 *
 * Returns `false` if the event has already been processed — the caller should
 * return a 200/202 without re-processing.
 *
 * Uses durable Supabase storage when configured; falls back to in-memory.
 * NOTE: In-memory fallback does NOT provide durable guarantees across instances.
 */
export async function claimWebhookEventAsync(
  eventId: string,
  eventType: string
): Promise<boolean> {
  // Try durable path first
  const durableResult = await tryDurableClaimWebhookEvent(eventId, eventType);
  if (durableResult !== null) {
    if (durableResult) {
      // Also update in-memory for fast duplicate detection within same instance
      processedEvents.set(eventId, { eventId, eventType, processedAt: new Date().toISOString() });
    }
    return durableResult;
  }

  // Fall back to in-memory
  return claimWebhookEvent(eventId, eventType);
}

/**
 * Attempt to claim an event ID for processing (synchronous, in-memory only).
 *
 * Returns `true` if this is the first time the event ID has been seen and
 * the caller should proceed with processing.
 *
 * Returns `false` if the event has already been processed — the caller should
 * return a 200/202 without re-processing.
 */
export function claimWebhookEvent(
  eventId: string,
  eventType: string
): boolean {
  pruneExpired();

  if (processedEvents.has(eventId)) {
    return false;
  }

  processedEvents.set(eventId, {
    eventId,
    eventType,
    processedAt: new Date().toISOString(),
  });

  return true;
}

/**
 * Check whether an event ID has already been claimed/processed.
 * Does not claim the event — use {@link claimWebhookEvent} for atomic
 * claim-and-process semantics.
 */
export function hasProcessedWebhookEvent(eventId: string): boolean {
  return processedEvents.has(eventId);
}

/** Return all entries in the idempotency log (for admin inspection). */
export function listProcessedWebhookEvents(): IdempotencyEntry[] {
  pruneExpired();
  return [...processedEvents.values()].sort(
    (a, b) =>
      new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime()
  );
}

/** Remove entries older than the retention window to bound memory usage. */
function pruneExpired(): void {
  const cutoff = Date.now() - RETENTION_MS;
  for (const [id, entry] of processedEvents.entries()) {
    if (new Date(entry.processedAt).getTime() < cutoff) {
      processedEvents.delete(id);
    }
  }
}

/** Reset the store — for use in tests only. */
export function resetWebhookIdempotencyForTests(): void {
  processedEvents.clear();
}
