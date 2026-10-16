/**
 * Single-flight, bounded-lifetime reads of a durable index.
 *
 * A failed/empty read must not permanently pin an empty index in a warm
 * process or erase the last successfully read index. A successful later read
 * replaces the fallback, while seed() publishes an explicit successful rebuild
 * to the current process immediately.
 */
export function createExpiringFallbackCache<T>(
  load: () => Promise<T | null>,
  empty: () => T,
  ttlMs: number,
  clock: () => number = Date.now,
) {
  let current: { at: number; value: Promise<T> } | null = null;
  let lastKnown: T | null = null;
  return {
    read(): Promise<T> {
      const at = clock();
      if (current && at >= current.at && at - current.at < ttlMs) return current.value;
      const value = Promise.resolve()
        .then(load)
        .then((loaded) => {
          if (loaded !== null) {
            // A completed rebuild can supersede an older in-flight read.
            if (current?.value === value) lastKnown = loaded;
            return loaded;
          }
          return lastKnown ?? empty();
        })
        .catch(() => lastKnown ?? empty());
      current = { at, value };
      return value;
    },
    seed(value: T): void {
      lastKnown = value;
      current = { at: clock(), value: Promise.resolve(value) };
    },
    clear(): void {
      current = null;
      lastKnown = null;
    },
  };
}
