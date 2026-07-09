import { NextResponse } from "next/server";

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type JsonObject = Record<string, unknown>;

const rateLimitState = globalThis as typeof globalThis & {
  __edunancialRateLimitStore?: Map<string, number[]>;
};

const rateLimitStore =
  rateLimitState.__edunancialRateLimitStore ??
  (rateLimitState.__edunancialRateLimitStore = new Map<string, number[]>());

export function getClientAddress(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function buildRateLimitKey(scope: string, request: Request): string {
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  return `${scope}:${getClientAddress(request)}:${userAgent.slice(0, 120)}`;
}

export function isRateLimited(key: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  const windowStart = now - options.windowMs;
  const existing = rateLimitStore.get(key) ?? [];
  const active = existing.filter((timestamp) => timestamp >= windowStart);

  if (active.length >= options.limit) {
    rateLimitStore.set(key, active);
    return true;
  }

  active.push(now);
  rateLimitStore.set(key, active);
  return false;
}

export function sanitizeText(value: unknown, maxLength = 120): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const sanitized = value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

  return sanitized.length > 0 ? sanitized : null;
}

export function sanitizeMetadata(
  value: unknown,
  depth = 0
): JsonObject | string | number | boolean | null {
  if (value == null) {
    return null;
  }

  if (typeof value === "string") {
    return sanitizeText(value, 300) ?? null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    if (depth >= 2) {
      return value.length;
    }

    return {
      items: value.slice(0, 10).map((item) => sanitizeMetadata(item, depth + 1)),
    };
  }

  if (typeof value === "object") {
    if (depth >= 2) {
      return null;
    }

    return Object.fromEntries(
      Object.entries(value as JsonObject)
        .slice(0, 20)
        .map(([key, entryValue]) => [
          sanitizeText(key, 80) ?? "field",
          sanitizeMetadata(entryValue, depth + 1),
        ])
    );
  }

  return null;
}

export async function readJsonBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function withApiHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
