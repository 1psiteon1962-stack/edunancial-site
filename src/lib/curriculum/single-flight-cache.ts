/**
 * Bounded, short-lived read-only Promise cache for Blob-backed lookups.
 * Concurrent callers share one read; a rejected read is evicted immediately
 * so transient storage faults never poison subsequent attempts.
 */
export function createSingleFlightCache<T>(
  load: (key: string) => Promise<T>,
  ttlMs: number,
  maxEntries = 512,
  clock: () => number = Date.now,
) {
  const entries = new Map<string, { at: number; promise: Promise<T> }>();
  return {
    read(key: string): Promise<T> {
      const now = clock();
      const existing = entries.get(key);
      if (existing && now >= existing.at && now - existing.at < ttlMs) return existing.promise;
      if (existing) entries.delete(key);
      for (const [name, entry] of entries) {
        if (now < entry.at || now - entry.at >= ttlMs) entries.delete(name);
      }
      while (entries.size >= maxEntries) {
        const oldest = entries.keys().next().value;
        if (oldest === undefined) break;
        entries.delete(oldest);
      }
      const promise = Promise.resolve().then(() => load(key));
      entries.set(key, { at: now, promise });
      void promise.catch(() => {
        if (entries.get(key)?.promise === promise) entries.delete(key);
      });
      return promise;
    },
    clear() { entries.clear(); },
  };
}
