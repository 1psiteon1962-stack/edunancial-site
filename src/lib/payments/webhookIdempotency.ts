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
 * The store is in-memory for simplicity.  In a multi-instance deployment,
 * replace the Map with a shared key-value store (e.g. Supabase, Redis).
 */

interface IdempotencyEntry {
  eventId: string;
  eventType: string;
  processedAt: string;
}

/** How long to remember a processed event (72 hours). */
const RETENTION_MS = 72 * 60 * 60 * 1_000;

const processedEvents = new Map<string, IdempotencyEntry>();

/**
 * Attempt to claim an event ID for processing.
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
