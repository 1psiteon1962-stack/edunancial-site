/**
 * In-memory rate limiter for AI API routes.
 * Uses a sliding window per identifier (IP or user ID).
 *
 * Note: This is suitable for single-instance deployments (Netlify edge/serverless
 * cold-starts will reset state). For multi-instance production deployments,
 * replace the in-memory store with Redis or Upstash.
 */

interface RateLimitWindow {
  count: number;
  windowStartMs: number;
}

/** Per-identifier sliding windows. */
const store = new Map<string, RateLimitWindow>();

/** Sweep expired entries every 5 minutes to prevent unbounded growth. */
let lastSweepMs = Date.now();
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

function maybeSweep(windowMs: number): void {
  const now = Date.now();
  if (now - lastSweepMs < SWEEP_INTERVAL_MS) return;
  lastSweepMs = now;
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStartMs > windowMs * 2) {
      store.delete(key);
    }
  }
}

export interface RateLimitOptions {
  /** Maximum requests allowed within the window. */
  limit: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAtMs: number;
}

/**
 * Check and record a rate-limit hit for the given identifier.
 *
 * @param identifier - IP address or user ID
 * @param options    - limit and window configuration
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const { limit, windowMs } = options;
  const now = Date.now();

  maybeSweep(windowMs);

  const entry = store.get(identifier);

  if (!entry || now - entry.windowStartMs > windowMs) {
    // New window
    store.set(identifier, { count: 1, windowStartMs: now });
    return {
      allowed: true,
      remaining: limit - 1,
      resetAtMs: now + windowMs,
    };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAtMs: entry.windowStartMs + windowMs,
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAtMs: entry.windowStartMs + windowMs,
  };
}

/** Default limits for the AI chat route. */
export const AI_CHAT_RATE_LIMIT: RateLimitOptions = {
  limit: 20,      // 20 requests
  windowMs: 60_000, // per 60 seconds
};
