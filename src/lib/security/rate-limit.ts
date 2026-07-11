type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const storeHost = globalThis as typeof globalThis & {
  __edunancialRateLimitStore?: Map<string, RateLimitBucket>;
};

const rateLimitStore =
  storeHost.__edunancialRateLimitStore ??
  (storeHost.__edunancialRateLimitStore = new Map<string, RateLimitBucket>());

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of rateLimitStore.entries()) {
    if (bucket.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

function getClientAddress(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function applyRateLimit(options: {
  request: Request;
  name: string;
  limit: number;
  windowMs: number;
  sessionKey?: string | null;
}) {
  const now = Date.now();
  pruneExpiredBuckets(now);

  const identity = options.sessionKey || getClientAddress(options.request);
  const storeKey = `${options.name}:${identity}`;
  const existing = rateLimitStore.get(storeKey);

  if (!existing || existing.resetAt <= now) {
    const nextBucket = {
      count: 1,
      resetAt: now + options.windowMs,
    };

    rateLimitStore.set(storeKey, nextBucket);

    return {
      allowed: true,
      remaining: options.limit - 1,
      resetAt: nextBucket.resetAt,
    };
  }

  existing.count += 1;
  rateLimitStore.set(storeKey, existing);

  return {
    allowed: existing.count <= options.limit,
    remaining: Math.max(options.limit - existing.count, 0),
    resetAt: existing.resetAt,
  };
}
