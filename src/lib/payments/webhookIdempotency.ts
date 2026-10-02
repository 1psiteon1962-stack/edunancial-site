import { getNeonSql } from "@/lib/db/neon";

interface WebhookEventRecord {
  eventId: string;
  eventType: string;
  processedAt: string;
}

const testEvents = new Map<string, WebhookEventRecord>();
let forceTestMemory = false;

function paymentWebhookSql() {
  return forceTestMemory ? null : getNeonSql();
}

export function claimWebhookEvent(eventId: string, eventType: string, rawPayload?: unknown): boolean | Promise<boolean> {
  if (!eventId.trim()) return false;
  const sql = paymentWebhookSql();
  if (!sql) {
    if (testEvents.has(eventId)) return false;
    testEvents.set(eventId, { eventId, eventType: eventType || "unknown", processedAt: new Date().toISOString() });
    return true;
  }
  return (async () => {
    const rows = await sql`insert into webhook_events (event_id,event_type,provider,processed,duplicate,raw_payload)
      values (${eventId},${eventType || "unknown"},${"square"},false,false,${JSON.stringify(rawPayload ?? null)}::jsonb)
      on conflict (event_id) do nothing returning event_id`;
    return rows.length > 0;
  })();
}

export function hasProcessedWebhookEvent(eventId: string): boolean | Promise<boolean> {
  const sql = paymentWebhookSql();
  if (!sql) return testEvents.has(eventId);
  return (async () => {
    const rows = await sql`select event_id from webhook_events where event_id=${eventId} limit 1`;
    return rows.length > 0;
  })();
}

export function listProcessedWebhookEvents(): WebhookEventRecord[] | Promise<WebhookEventRecord[]> {
  const sql = paymentWebhookSql();
  if (!sql) return [...testEvents.values()].sort((a,b) => b.processedAt.localeCompare(a.processedAt));
  return (async () => {
    const rows = await sql`select event_id,event_type,processed_at from webhook_events order by processed_at desc limit 500`;
    return rows.map((row) => ({ eventId:String(row.event_id), eventType:String(row.event_type), processedAt:String(row.processed_at) }));
  })();
}

export async function markWebhookEventProcessed(eventId: string): Promise<void> {
  const sql = paymentWebhookSql();
  if (!sql) return;
  await sql`update webhook_events set processed=true,processed_at=now() where event_id=${eventId}`;
}

export function resetWebhookIdempotencyForTests(): void {
  testEvents.clear();
  // These tests assert the synchronous replay-protection contract. A CI
  // DATABASE_URL must not silently convert them into network-backed promises.
  forceTestMemory = true;
}
