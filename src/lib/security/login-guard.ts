import { getStore } from "@netlify/blobs";

import { detectTrustedRequestCountry } from "@/lib/location/request-country";

/**
 * Durable login protection. Unlike the in-memory limiter, failure counts live
 * in Netlify Blobs, so they survive restarts and are shared by every server
 * instance. Locks an account after repeated failures from anywhere, and an
 * address after repeated failures against any account.
 *
 * Fails open (allows the attempt) if the store is unreachable, so a storage
 * outage never locks the owner out; the in-memory limiter still applies.
 */

const STORE = "security-login-guard";
const EVENTS_STORE = "security-events";

export const LOGIN_GUARD_POLICY = {
  windowMs: 60 * 60 * 1000,
  accountFailures: 8,
  addressFailures: 20,
  lockMs: 30 * 60 * 1000,
} as const;

type Counter = { failures: number[]; lockedUntil: number | null };

export type SecurityEvent = {
  type: "login_failure" | "login_locked" | "login_success" | "owner_link_denied" | "owner_link_limited";
  scope: string;
  account: string | null;
  addressHash: string | null;
  country: string | null;
  at: string;
  detail?: Record<string, unknown>;
};

function guardStore() {
  return getStore({ name: STORE, consistency: "strong" });
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export function requestAddress(request: Request) {
  return (
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function requestCountry(request: Request) {
  return detectTrustedRequestCountry(request.headers)?.countryCode ?? null;
}

async function keys(scope: string, request: Request, account: string | null) {
  const addressHash = await sha256(requestAddress(request));
  const accountHash = account ? await sha256(account.trim().toLowerCase()) : null;
  return {
    addressHash,
    addressKey: `${scope}/address/${addressHash}`,
    accountKey: accountHash ? `${scope}/account/${accountHash}` : null,
  };
}

async function read(key: string): Promise<Counter> {
  const raw = (await guardStore().get(key, { type: "json" })) as Counter | null;
  return raw && Array.isArray(raw.failures) ? raw : { failures: [], lockedUntil: null };
}

export async function recordSecurityEvent(event: SecurityEvent) {
  try {
    const id = crypto.randomUUID();
    await getStore({ name: EVENTS_STORE, consistency: "eventual" }).setJSON(`events/${event.at.slice(0, 10)}/${event.at}-${id}`, event);
  } catch (error) {
    console.error("security-event: unable to record", error);
  }
}

/** Returns whether this login attempt may proceed. */
export async function checkLoginAllowed(scope: string, request: Request, account: string | null) {
  try {
    const now = Date.now();
    const k = await keys(scope, request, account);
    const counters = await Promise.all([read(k.addressKey), k.accountKey ? read(k.accountKey) : null]);
    const lockedUntil = Math.max(...counters.map((c) => (c?.lockedUntil && c.lockedUntil > now ? c.lockedUntil : 0)));
    if (lockedUntil > 0) return { allowed: false as const, retryAfterSeconds: Math.ceil((lockedUntil - now) / 1000) };
    return { allowed: true as const, retryAfterSeconds: 0 };
  } catch (error) {
    console.error("login-guard: check failed; allowing attempt", error);
    return { allowed: true as const, retryAfterSeconds: 0 };
  }
}

export async function recordLoginFailure(scope: string, request: Request, account: string | null, reason: string) {
  const now = Date.now();
  const at = new Date(now).toISOString();
  try {
    const k = await keys(scope, request, account);
    let locked = false;
    for (const [key, limit] of [
      [k.addressKey, LOGIN_GUARD_POLICY.addressFailures],
      [k.accountKey, LOGIN_GUARD_POLICY.accountFailures],
    ] as const) {
      if (!key) continue;
      const counter = await read(key);
      counter.failures = [...counter.failures.filter((t) => now - t < LOGIN_GUARD_POLICY.windowMs), now].slice(-100);
      if (counter.failures.length >= limit) {
        counter.lockedUntil = now + LOGIN_GUARD_POLICY.lockMs;
        locked = true;
      }
      await guardStore().setJSON(key, counter);
    }
    await recordSecurityEvent({ type: locked ? "login_locked" : "login_failure", scope, account, addressHash: k.addressHash, country: requestCountry(request), at, detail: { reason } });
  } catch (error) {
    console.error("login-guard: unable to record failure", error);
  }
}

export async function recordLoginSuccess(scope: string, request: Request, account: string) {
  try {
    const k = await keys(scope, request, account);
    if (k.accountKey) await guardStore().delete(k.accountKey);
    await recordSecurityEvent({ type: "login_success", scope, account, addressHash: k.addressHash, country: requestCountry(request), at: new Date().toISOString() });
  } catch (error) {
    console.error("login-guard: unable to record success", error);
  }
}

/** Security events for a date range (inclusive), newest first. */
export async function listSecurityEvents(sinceIso: string, limit = 2000): Promise<SecurityEvent[]> {
  const store = getStore({ name: EVENTS_STORE, consistency: "strong" });
  const days: string[] = [];
  for (let d = new Date(sinceIso.slice(0, 10)); d <= new Date(); d.setUTCDate(d.getUTCDate() + 1)) days.push(d.toISOString().slice(0, 10));
  const events: SecurityEvent[] = [];
  for (const day of days) {
    const { blobs } = await store.list({ prefix: `events/${day}/` });
    for (const blob of blobs) {
      if (events.length >= limit) break;
      const event = (await store.get(blob.key, { type: "json" })) as SecurityEvent | null;
      if (event) events.push(event);
    }
  }
  return events.sort((a, b) => b.at.localeCompare(a.at));
}
