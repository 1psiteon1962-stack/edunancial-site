/**
 * Server-side rate limiter for authentication endpoints.
 *
 * Uses an in-memory store (per serverless instance). For multi-instance
 * deployments, swap the store for a Redis or Supabase-backed implementation.
 * For Netlify, this is acceptable because individual serverless functions
 * are single-process and the rate limit is a defense-in-depth measure
 * combined with CAPTCHA/progressive delays at the UI layer.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) {
        store.delete(key);
      }
    }
  }, 60_000);
}

export interface RateLimitConfig {
  /** Unique scope (e.g. "auth:login", "auth:register") */
  scope: string;
  /** Rate limit key (e.g. IP address or normalized email) */
  key: string;
  /** Maximum number of requests in the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterMs: number;
}

export function checkRateLimit(config: RateLimitConfig): RateLimitResult {
  const storeKey = `${config.scope}:${config.key}`;
  const now = Date.now();
  const entry = store.get(storeKey);

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + config.windowMs;
    store.set(storeKey, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
      retryAfterMs: 0,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfterMs: entry.resetAt - now,
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
    retryAfterMs: 0,
  };
}

// Pre-configured limiters
export const loginRateLimit = (key: string) =>
  checkRateLimit({ scope: "auth:login", key, maxRequests: 10, windowMs: 15 * 60_000 });

export const registerRateLimit = (key: string) =>
  checkRateLimit({ scope: "auth:register", key, maxRequests: 5, windowMs: 60 * 60_000 });

export const forgotPasswordRateLimit = (key: string) =>
  checkRateLimit({ scope: "auth:forgot-password", key, maxRequests: 5, windowMs: 60 * 60_000 });

export const verifyEmailRateLimit = (key: string) =>
  checkRateLimit({ scope: "auth:verify-email", key, maxRequests: 10, windowMs: 60 * 60_000 });
