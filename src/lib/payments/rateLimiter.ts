interface RateLimitWindow {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitWindow>();

export function enforcePaymentRateLimit(input: {
  key: string;
  scope: string;
  maxRequests: number;
  windowMs: number;
}) {
  const storeKey = `${input.scope}:${input.key}`;
  const now = Date.now();
  const existing = rateLimitStore.get(storeKey);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(storeKey, {
      count: 1,
      resetAt: now + input.windowMs,
    });
    return {
      allowed: true,
      remaining: input.maxRequests - 1,
      resetAt: now + input.windowMs,
    };
  }

  existing.count += 1;
  rateLimitStore.set(storeKey, existing);

  return {
    allowed: existing.count <= input.maxRequests,
    remaining: Math.max(0, input.maxRequests - existing.count),
    resetAt: existing.resetAt,
  };
}
