/**
 * Bounded, short-lived read-only Promise cache for Blob-backed lookups.
 * Concurrent callers share one read, even when the underlying storage read
 * takes longer than the resolved-value TTL. A rejection is never cached.
 */
export function createSingleFlightCache<T>(
  load: (key: string) => Promise<T>,
  ttlMs: number,
  maxEntries = 512,
  clock: () => number = Date.now,
) {
  type Entry = { at: number; promise: Promise<T>; pending: boolean };
  const entries = new Map<string, Entry>();
  return {
    read(key: string): Promise<T> {
      const now = clock();
      const existing = entries.get(key);
      // A slow Blob read must not be duplicated at t=15s just because its
      // resolved-value TTL elapsed before the original Promise settled.
      if (existing && (existing.pending || (now >= existing.at && now - existing.at < ttlMs))) {
        return existing.promise;
      }
      if (existing) entries.delete(key);
      for (const [name, entry] of entries) {
        if (!entry.pending && (now < entry.at || now - entry.at >= ttlMs)) entries.delete(name);
      }
      while (entries.size >= maxEntries) {
        const oldest = entries.keys().next().value;
        if (oldest === undefined) break;
        entries.delete(oldest);
      }
      const promise = Promise.resolve().then(() => load(key));
      const entry: Entry = { at: now, promise, pending: true };
      entries.set(key, entry);
      void promise.then(
        () => {
          // Invalidation or capacity eviction can remove this entry while its
          // loader is pending; old completion must not repopulate the cache.
          if (entries.get(key) === entry) {
            entry.pending = false;
            entry.at = clock(); // TTL covers resolved data, not network latency.
          }
        },
        () => { if (entries.get(key) === entry) entries.delete(key); },
      );
      return promise;
    },
    clear() { entries.clear(); },
  };
}
