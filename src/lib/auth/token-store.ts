/**
 * Token revocation store (denylist).
 * In-memory implementation — replace with Redis or database in production.
 *
 * Stores JTI (JWT ID) of revoked tokens with their expiry time so that
 * the denylist can be pruned automatically.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RevokedTokenEntry {
  jti: string;
  sub: string;
  revokedAt: string;
  expiresAt: number; // unix ms — used for auto-cleanup
}

export interface TokenStore {
  revoke(entry: RevokedTokenEntry): Promise<void>;
  isRevoked(jti: string): Promise<boolean>;
  revokeAllForUser(sub: string): Promise<void>;
}

// ─── In-memory implementation ─────────────────────────────────────────────────

const denylist = new Map<string, RevokedTokenEntry>();

const inMemoryTokenStore: TokenStore = {
  async revoke(entry) {
    denylist.set(entry.jti, entry);
  },

  async isRevoked(jti) {
    const entry = denylist.get(jti);
    if (!entry) return false;
    // Auto-expire entries that are past token lifetime
    if (Date.now() > entry.expiresAt) {
      denylist.delete(jti);
      return false;
    }
    return true;
  },

  async revokeAllForUser(sub) {
    for (const [jti, entry] of denylist.entries()) {
      if (entry.sub === sub) {
        denylist.set(jti, { ...entry, revokedAt: new Date().toISOString() });
      }
    }
    // Mark all tokens for this user — in production, store a per-user revocation timestamp
    // and compare against token iat on every verify call.
    userRevocationTimestamps.set(sub, Date.now());
  },
};

// Per-user global revocation timestamps (all tokens issued before this are revoked)
const userRevocationTimestamps = new Map<string, number>();

export function getUserRevocationTimestamp(sub: string): number | undefined {
  return userRevocationTimestamps.get(sub);
}

// Periodic cleanup
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [jti, entry] of denylist.entries()) {
      if (now > entry.expiresAt) denylist.delete(jti);
    }
  }, 300_000); // every 5 minutes
}

// ─── Active store ─────────────────────────────────────────────────────────────

let activeStore: TokenStore = inMemoryTokenStore;

/** Replace the backing store (e.g. Redis adapter) in production. */
export function setTokenStore(store: TokenStore): void {
  activeStore = store;
}

export function getTokenStore(): TokenStore {
  return activeStore;
}

// ─── Convenience exports ──────────────────────────────────────────────────────

export async function revokeToken(
  jti: string,
  sub: string,
  expiresAt: number
): Promise<void> {
  await activeStore.revoke({
    jti,
    sub,
    revokedAt: new Date().toISOString(),
    expiresAt,
  });
}

export async function isTokenRevoked(jti: string): Promise<boolean> {
  return activeStore.isRevoked(jti);
}

export async function revokeAllUserTokens(sub: string): Promise<void> {
  return activeStore.revokeAllForUser(sub);
}
