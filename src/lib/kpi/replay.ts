export type ReplayStore<Row> = {
  list(options?: { prefix?: string; cursor?: string }): Promise<{ blobs: { key: string }[]; cursor?: string }>;
  get(key: string): Promise<{ row: Row } | null>;
  delete(key: string): Promise<unknown>;
};

export type ReplayResult = { attempted: number; recovered: number; failed: number; remaining: number };

/**
 * At-least-once recovery. The writer MUST be idempotent using a durable
 * event identity before this can be scheduled unattended: a process may crash
 * after a database commit but before the blob deletion.
 */
export async function replayKpiSpool<Row>(
  store: ReplayStore<Row>,
  writeIdempotently: (row: Row, key: string) => Promise<unknown>,
  options: { limit?: number; log?: (message: string, key: string) => void } = {},
): Promise<ReplayResult> {
  const limit = Math.max(1, Math.min(100, Math.trunc(options.limit ?? 50)));
  let attempted = 0;
  let recovered = 0;
  let failed = 0;
  let remaining = 0;
  let cursor: string | undefined;
  do {
    const page = await store.list({ prefix: "pending/", ...(cursor ? { cursor } : {}) });
    for (const { key } of page.blobs) {
      if (attempted >= limit) {
        remaining++;
        continue;
      }
      attempted++;
      try {
        const payload = await store.get(key);
        if (!payload || !payload.row) throw new Error("Missing or invalid spool payload");
        await writeIdempotently(payload.row, key);
        await store.delete(key);
        recovered++;
      } catch {
        failed++;
        options.log?.("KPI replay failed; blob retained for retry", key);
      }
    }
    cursor = page.cursor || undefined;
  } while (cursor && attempted < limit);
  return { attempted, recovered, failed, remaining };
}
