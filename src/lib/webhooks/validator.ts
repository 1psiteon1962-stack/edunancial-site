/**
 * Webhook signature validation and payload verification.
 *
 * Incoming webhooks are verified using HMAC-SHA256.
 * A timestamp is validated within a configurable tolerance window.
 */

import { ApiError } from "../api/errors";

const DEFAULT_TOLERANCE_S = 300; // 5 minutes

export interface IncomingWebhookOptions {
  /** Shared secret for HMAC-SHA256 verification */
  secret: string;
  /** Acceptable age of the webhook timestamp in seconds */
  toleranceSeconds?: number;
}

/**
 * Compute an HMAC-SHA256 hex digest of a message using a secret.
 */
export async function hmacSha256(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  );
  return Buffer.from(sig).toString("hex");
}

/**
 * Constant-time comparison to prevent timing attacks.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Build a signed webhook header value.
 * Format: t=<timestamp>,v1=<signature>
 */
export async function buildWebhookSignatureHeader(
  payload: string,
  secret: string,
  timestamp?: number
): Promise<string> {
  const ts = timestamp ?? Math.floor(Date.now() / 1000);
  const signed = `${ts}.${payload}`;
  const sig = await hmacSha256(secret, signed);
  return `t=${ts},v1=${sig}`;
}

/**
 * Validate an incoming webhook signature header.
 * Throws `ApiError` if the signature is missing, invalid, or the timestamp is out of tolerance.
 */
export async function validateWebhookSignature(
  payload: string,
  signatureHeader: string | null,
  opts: IncomingWebhookOptions
): Promise<void> {
  if (!signatureHeader) {
    throw new ApiError("INVALID_SIGNATURE" as never, "Missing webhook signature header", 401);
  }

  const parts = signatureHeader.split(",").reduce(
    (acc, part) => {
      const eq = part.indexOf("=");
      if (eq > 0) acc[part.slice(0, eq)] = part.slice(eq + 1);
      return acc;
    },
    {} as Record<string, string>
  );

  const ts = parts["t"];
  const v1 = parts["v1"];

  if (!ts || !v1) {
    throw new ApiError("INVALID_SIGNATURE" as never, "Malformed webhook signature header", 401);
  }

  // Timestamp tolerance check (replay protection)
  const tolerance = opts.toleranceSeconds ?? DEFAULT_TOLERANCE_S;
  const now = Math.floor(Date.now() / 1000);
  const age = Math.abs(now - parseInt(ts, 10));

  if (age > tolerance) {
    throw new ApiError(
      "REPLAY_DETECTED" as never,
      `Webhook timestamp too old (${age}s). Tolerance is ${tolerance}s`,
      400
    );
  }

  const signed = `${ts}.${payload}`;
  const expected = await hmacSha256(opts.secret, signed);

  if (!safeEqual(expected, v1)) {
    throw new ApiError("INVALID_SIGNATURE" as never, "Webhook signature mismatch", 401);
  }
}

/**
 * Extract the raw body string from a Request (consumes the body stream once).
 */
export async function extractRawBody(request: Request): Promise<string> {
  return request.text();
}
