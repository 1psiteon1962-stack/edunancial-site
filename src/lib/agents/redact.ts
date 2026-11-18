// Removes secrets and personal identifiers before anything is written to the audit log.

const REDACTED_KEYS = new Set([
  "token",
  "accesstoken",
  "refreshtoken",
  "apikey",
  "password",
  "secret",
  "authorization",
  "email",
  "cookie",
]);

const MAX_DEPTH = 8;

function shouldRedact(key: string): boolean {
  return REDACTED_KEYS.has(key.toLowerCase().replace(/[^a-z]/g, ""));
}

function redactValue(value: unknown, depth: number): unknown {
  if (depth > MAX_DEPTH) return "[truncated]";
  if (Array.isArray(value)) return value.map((item) => redactValue(item, depth + 1));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, inner] of Object.entries(value as Record<string, unknown>)) {
      if (shouldRedact(key)) continue;
      out[key] = redactValue(inner, depth + 1);
    }
    return out;
  }
  return value;
}

export function redactAuditDetail(detail: Record<string, unknown> | undefined | null): Record<string, unknown> {
  if (!detail || typeof detail !== "object") return {};
  return redactValue(detail, 0) as Record<string, unknown>;
}
