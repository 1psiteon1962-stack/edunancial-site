import { getSupabaseAdminClient } from "@/lib/supabase/admin";

interface WebhookEventRecord {
  eventId: string;
  eventType: string;
  processedAt: string;
}

const testEvents = new Map<string, WebhookEventRecord>();

function hasSharedStoreConfig(): boolean {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim() &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim()
  );
}

/**
 * Atomically claims a Square webhook event.
 *
 * Production uses the shared Supabase webhook_events table, whose unique
 * event_id constraint prevents duplicate processing across Netlify instances.
 * Local/unit-test environments without server credentials use an isolated
 * in-memory store so tests never require production secrets.
 */
export function claimWebhookEvent(
  eventId: string,
  eventType: string,
  rawPayload?: unknown
): boolean | Promise<boolean> {
  if (!eventId.trim()) return false;

  if (!hasSharedStoreConfig()) {
    if (testEvents.has(eventId)) return false;
    testEvents.set(eventId, {
      eventId,
      eventType: eventType || "unknown",
      processedAt: new Date().toISOString(),
    });
    return true;
  }

  return claimSharedWebhookEvent(eventId, eventType, rawPayload);
}

async function claimSharedWebhookEvent(
  eventId: string,
  eventType: string,
  rawPayload?: unknown
): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("webhook_events").insert({
    event_id: eventId,
    event_type: eventType || "unknown",
    provider: "square",
    processed: false,
    duplicate: false,
    raw_payload: rawPayload ?? null,
  });

  if (!error) return true;
  if (error.code === "23505") return false;

  throw new Error(`Unable to claim Square webhook event: ${error.message}`);
}

export function hasProcessedWebhookEvent(eventId: string): boolean | Promise<boolean> {
  if (!hasSharedStoreConfig()) return testEvents.has(eventId);

  return (async () => {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("webhook_events")
      .select("event_id")
      .eq("event_id", eventId)
      .maybeSingle();

    if (error) throw new Error(`Unable to inspect Square webhook event: ${error.message}`);
    return Boolean(data);
  })();
}

export function listProcessedWebhookEvents(): WebhookEventRecord[] | Promise<WebhookEventRecord[]> {
  if (!hasSharedStoreConfig()) {
    return [...testEvents.values()].sort((a, b) => b.processedAt.localeCompare(a.processedAt));
  }

  return (async () => {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("webhook_events")
      .select("event_id,event_type,processed_at")
      .order("processed_at", { ascending: false })
      .limit(500);

    if (error) throw new Error(`Unable to list Square webhook events: ${error.message}`);

    return (data ?? []).map((row) => ({
      eventId: String(row.event_id),
      eventType: String(row.event_type),
      processedAt: String(row.processed_at),
    }));
  })();
}

/** Mark a successfully handled production event complete for audit/recovery. */
export async function markWebhookEventProcessed(eventId: string): Promise<void> {
  if (!hasSharedStoreConfig()) return;

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("webhook_events")
    .update({ processed: true, processed_at: new Date().toISOString() })
    .eq("event_id", eventId);

  if (error) {
    throw new Error(`Unable to mark Square webhook event processed: ${error.message}`);
  }
}

/** Reset only the isolated non-production store used by automated tests. */
export function resetWebhookIdempotencyForTests(): void {
  testEvents.clear();
}
