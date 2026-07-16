const buckets = new Map<string, number[]>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const bucket = (buckets.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
  if (bucket.length >= maxRequests) {
    buckets.set(key, bucket);
    return { allowed: false, remaining: 0, resetAt: bucket[0] + windowMs };
  }

  bucket.push(now);
  buckets.set(key, bucket);
  return { allowed: true, remaining: Math.max(0, maxRequests - bucket.length), resetAt: now + windowMs };
}

export function getRateLimitKey(prefix: string, request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  return `${prefix}:${forwardedFor.split(",")[0].trim()}:${userAgent.slice(0, 64)}`;
}
