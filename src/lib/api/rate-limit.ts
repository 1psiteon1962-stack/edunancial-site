/**
 * In-memory sliding-window rate limiter suitable for edge/serverless deployments.
 * Replace the store with a Redis-backed adapter for multi-instance production use.
 */

import { ApiError } from "./errors";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RateLimitOptions {
  /** Maximum number of requests in the window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
  /** Header prefix to report remaining quota. */
  headerPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // unix ms
}

export interface RateLimitStore {
  increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}

// ─── In-memory store (single-instance, for development/edge with single pod) ──

interface WindowEntry {
  count: number;
  resetAt: number;
}

const memStore = new Map<string, WindowEntry>();

const inMemoryStore: RateLimitStore = {
  async increment(key: string, windowMs: number) {
    const now = Date.now();
    const entry = memStore.get(key);
    if (!entry || now >= entry.resetAt) {
      const resetAt = now + windowMs;
      memStore.set(key, { count: 1, resetAt });
      return { count: 1, resetAt };
    }
    entry.count++;
    return { count: entry.count, resetAt: entry.resetAt };
  },
};

// Cleanup expired entries periodically (avoid unbounded memory growth)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memStore.entries()) {
      if (now >= entry.resetAt) memStore.delete(key);
    }
  }, 60_000);
}

// ─── Core function ────────────────────────────────────────────────────────────

let activeStore: RateLimitStore = inMemoryStore;

/** Replace the backing store (e.g. swap in a Redis adapter in production). */
export function setRateLimitStore(store: RateLimitStore): void {
  activeStore = store;
}

export async function checkRateLimit(
  key: string,
  opts: RateLimitOptions
): Promise<RateLimitResult> {
  const { count, resetAt } = await activeStore.increment(key, opts.windowMs);
  const remaining = Math.max(0, opts.limit - count);
  return {
    allowed: count <= opts.limit,
    limit: opts.limit,
    remaining,
    resetAt,
  };
}

// ─── Middleware helper ────────────────────────────────────────────────────────

/**
 * Extract a rate-limit key from a request.
 * Uses X-Forwarded-For or the remote address.
 */
export function extractRateLimitKey(request: Request, prefix = "global"): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return `${prefix}:${ip}`;
}

/**
 * Assert that the request has not exceeded the rate limit.
 * Throws `ApiError` (rate limited) if the limit is exceeded.
 * Returns headers to attach to the response.
 */
export async function enforceRateLimit(
  request: Request,
  opts: RateLimitOptions & { keyPrefix?: string }
): Promise<Record<string, string>> {
  const key = extractRateLimitKey(request, opts.keyPrefix ?? "api");
  const result = await checkRateLimit(key, opts);

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };

  if (!result.allowed) {
    throw Object.assign(ApiError.rateLimited(), { headers });
  }

  return headers;
}

// ─── Presets ──────────────────────────────────────────────────────────────────

export const RATE_LIMIT_PRESETS = {
  /** General API endpoints */
  api: { limit: 120, windowMs: 60_000 } as RateLimitOptions,
  /** Auth endpoints (stricter) */
  auth: { limit: 10, windowMs: 60_000 } as RateLimitOptions,
  /** Webhook ingestion */
  webhooks: { limit: 200, windowMs: 60_000 } as RateLimitOptions,
  /** Public / unauthenticated */
  public: { limit: 30, windowMs: 60_000 } as RateLimitOptions,
} as const;
