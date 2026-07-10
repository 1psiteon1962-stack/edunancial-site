/**
 * API key authentication for server-to-server requests.
 *
 * Keys are stored as HMAC-SHA256 hashes (never in plain text).
 * A key has the form:  ek_live_<random32hex>  or  ek_test_<random32hex>
 *
 * Environment variables:
 *   API_KEY_SECRET – secret used to hash / verify keys
 *
 * In production, replace the in-memory registry with a database lookup.
 */

import { ApiError } from "../api/errors";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApiKeyEnvironment = "live" | "test";

export interface ApiKeyRecord {
  id: string;
  hashedKey: string;
  ownerId: string;
  scopes: string[];
  environment: ApiKeyEnvironment;
  createdAt: string;
  revokedAt?: string;
}

// ─── In-memory registry (replace with DB in production) ───────────────────────

const keyRegistry = new Map<string, ApiKeyRecord>();

// ─── Crypto helpers ───────────────────────────────────────────────────────────

async function hmacKey(): Promise<CryptoKey> {
  const secret = process.env.API_KEY_SECRET ?? "insecure-dev-secret-change-me";
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function hashKey(rawKey: string): Promise<string> {
  const key = await hmacKey();
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(rawKey)
  );
  return Buffer.from(sig).toString("hex");
}

function generateRawKey(env: ApiKeyEnvironment): string {
  const random = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `ek_${env}_${random}`;
}

// ─── API ──────────────────────────────────────────────────────────────────────

/**
 * Create a new API key for an owner.
 * Returns the raw key (shown only once) and registers the hashed record.
 */
export async function createApiKey(
  ownerId: string,
  scopes: string[] = [],
  environment: ApiKeyEnvironment = "live"
): Promise<{ rawKey: string; record: ApiKeyRecord }> {
  const rawKey = generateRawKey(environment);
  const hashedKey = await hashKey(rawKey);
  const id = `ak_${Date.now()}_${ownerId.slice(0, 8)}`;

  const record: ApiKeyRecord = {
    id,
    hashedKey,
    ownerId,
    scopes,
    environment,
    createdAt: new Date().toISOString(),
  };

  keyRegistry.set(hashedKey, record);
  return { rawKey, record };
}

/**
 * Register an externally-created hashed API key (e.g. seeded from DB).
 */
export function registerApiKey(record: ApiKeyRecord): void {
  keyRegistry.set(record.hashedKey, record);
}

/**
 * Verify an API key from a request.
 * Accepts key via `X-API-Key` header or `api_key` query param.
 * Throws `ApiError` if missing, invalid or revoked.
 */
export async function verifyApiKey(request: Request): Promise<ApiKeyRecord> {
  const rawKey =
    request.headers.get("x-api-key") ??
    new URL(request.url).searchParams.get("api_key");

  if (!rawKey) throw ApiError.unauthorized("Missing API key");

  const hashed = await hashKey(rawKey);
  const record = keyRegistry.get(hashed);

  if (!record) throw ApiError.unauthorized("Invalid API key");
  if (record.revokedAt) {
    throw new ApiError(
      "TOKEN_REVOKED" as never,
      "API key has been revoked",
      401
    );
  }

  return record;
}

/**
 * Revoke an API key by its id.
 */
export function revokeApiKey(id: string): boolean {
  for (const [hash, record] of keyRegistry.entries()) {
    if (record.id === id) {
      keyRegistry.set(hash, { ...record, revokedAt: new Date().toISOString() });
      return true;
    }
  }
  return false;
}

/**
 * Extract API key from request without throwing (returns null if absent).
 */
export function extractApiKey(request: Request): string | null {
  return (
    request.headers.get("x-api-key") ??
    new URL(request.url).searchParams.get("api_key") ??
    null
  );
}
