/**
 * Replay protection for incoming webhooks.
 * Stores processed event IDs in a time-bounded cache to prevent duplicate processing.
 */

export interface ReplayStore {
  has(eventId: string): Promise<boolean>;
  add(eventId: string, expiresAt: number): Promise<void>;
}

// ─── In-memory replay store ───────────────────────────────────────────────────

interface ReplayEntry {
  expiresAt: number;
}

const replayCache = new Map<string, ReplayEntry>();

const inMemoryReplayStore: ReplayStore = {
  async has(eventId) {
    const entry = replayCache.get(eventId);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      replayCache.delete(eventId);
      return false;
    }
    return true;
  },
  async add(eventId, expiresAt) {
    replayCache.set(eventId, { expiresAt });
  },
};

// Periodic cleanup
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [id, entry] of replayCache.entries()) {
      if (now > entry.expiresAt) replayCache.delete(id);
    }
  }, 120_000);
}

// ─── Active store ─────────────────────────────────────────────────────────────

let activeStore: ReplayStore = inMemoryReplayStore;

export function setReplayStore(store: ReplayStore): void {
  activeStore = store;
}

/**
 * Check and mark a webhook event ID.
 * Returns `true` if this is a replay (already seen).
 * Returns `false` and records the ID if it is new.
 *
 * @param eventId   – Unique event identifier
 * @param ttlMs     – How long to remember the ID (default: 24 hours)
 */
export async function checkAndMarkReplay(
  eventId: string,
  ttlMs = 86_400_000
): Promise<boolean> {
  const seen = await activeStore.has(eventId);
  if (seen) return true;
  await activeStore.add(eventId, Date.now() + ttlMs);
  return false;
}
