export const CSRF_COOKIE_NAME = "edunancial_csrf";

const MUTATING_METHODS = new Set(["DELETE", "PATCH", "POST", "PUT"]);

export function createCsrfToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === name) {
      return rawValue.join("=") || null;
    }
  }

  return null;
}

function getOriginFromHeader(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function validateCsrfRequest(request: Request): {
  ok: boolean;
  reason?: string;
} {
  if (!MUTATING_METHODS.has(request.method.toUpperCase())) {
    return { ok: true };
  }

  const requestUrl = new URL(request.url);
  const origin =
    getOriginFromHeader(request.headers.get("origin")) ??
    getOriginFromHeader(request.headers.get("referer"));

  if (origin && origin !== requestUrl.origin) {
    return { ok: false, reason: "origin_mismatch" };
  }

  const cookieToken = getCookieValue(request.headers.get("cookie"), CSRF_COOKIE_NAME);
  const headerToken = request.headers.get("x-csrf-token");

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return { ok: false, reason: "token_mismatch" };
  }

  return { ok: true };
}
