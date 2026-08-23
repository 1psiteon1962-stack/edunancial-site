import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Atomically claims a Square webhook event in the shared Supabase store.
 *
 * The webhook_events.event_id UNIQUE constraint is the concurrency boundary:
 * only the first delivery can insert the event. Every later delivery, including
 * retries handled by another Netlify instance, is treated as a duplicate.
 */
export async function claimWebhookEvent(
  eventId: string,
  eventType: string,
  rawPayload?: unknown
): Promise<boolean> {
  if (!eventId.trim()) {
    return false;
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("webhook_events").insert({
    event_id: eventId,
    event_type: eventType || "unknown",
    provider: "square",
    processed: false,
    duplicate: false,
    raw_payload: rawPayload ?? null,
  });

  if (!error) {
    return true;
  }

  // PostgreSQL unique_violation. A prior delivery already owns this event ID.
  if (error.code === "23505") {
    return false;
  }

  // Fail closed: if the shared idempotency store is unavailable, do not risk
  // processing the same payment/membership event more than once.
  throw new Error(`Unable to claim Square webhook event: ${error.message}`);
}

/** Mark a successfully handled event complete for audit/recovery purposes. */
export async function markWebhookEventProcessed(eventId: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("webhook_events")
    .update({ processed: true, processed_at: new Date().toISOString() })
    .eq("event_id", eventId);

  if (error) {
    throw new Error(`Unable to mark Square webhook event processed: ${error.message}`);
  }
}
