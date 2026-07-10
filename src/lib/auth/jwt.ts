/**
 * JWT authentication utilities.
 * Uses the Web Crypto API (built into Node 18+ / Edge Runtime) — no external dependencies.
 *
 * Environment variables:
 *   JWT_SECRET          – HS256 signing secret (min 32 chars)
 *   JWT_ACCESS_TTL_S    – Access token TTL in seconds  (default: 900  = 15 min)
 *   JWT_REFRESH_TTL_S   – Refresh token TTL in seconds (default: 604800 = 7 days)
 */

import { ApiError } from "../api/errors";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TokenType = "access" | "refresh" | "service";

export interface JwtClaims {
  sub: string;           // subject (user id or service account id)
  type: TokenType;
  roles?: string[];
  scopes?: string[];
  jti?: string;          // JWT ID (unique token id, used for revocation)
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string | string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ISSUER = "edunancial-api";
const AUDIENCE = "edunancial-clients";

function getTtl(envVar: string, fallback: number): number {
  const raw = process.env[envVar];
  return raw ? parseInt(raw, 10) : fallback;
}

// ─── Crypto helpers ───────────────────────────────────────────────────────────

async function importKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function b64url(buf: ArrayBuffer): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function b64urlDecode(str: string): string {
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
}

function generateJti(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Sign / Verify ────────────────────────────────────────────────────────────

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET env var is missing or too short (min 32 chars)");
  }
  return secret;
}

/**
 * Sign a JWT with HS256.
 */
export async function signJwt(
  payload: Omit<JwtClaims, "iat" | "exp" | "iss" | "aud" | "jti">,
  ttlSeconds: number
): Promise<string> {
  const secret = getSecret();
  const now = Math.floor(Date.now() / 1000);
  const claims: JwtClaims = {
    ...payload,
    jti: generateJti(),
    iat: now,
    exp: now + ttlSeconds,
    iss: ISSUER,
    aud: AUDIENCE,
  };

  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })).buffer as ArrayBuffer);
  const body = b64url(new TextEncoder().encode(JSON.stringify(claims)).buffer as ArrayBuffer);
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${header}.${body}`)
  );

  return `${header}.${body}.${b64url(signature)}`;
}

/**
 * Verify a JWT and return its claims.
 * Throws `ApiError` if the token is invalid, expired, or has wrong audience/issuer.
 */
export async function verifyJwt(token: string): Promise<JwtClaims> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw ApiError.unauthorized("Invalid token format");
  }

  const [header, body, sig] = parts;

  const secret = getSecret();
  const key = await importKey(secret);

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    Buffer.from(sig.replace(/-/g, "+").replace(/_/g, "/"), "base64"),
    new TextEncoder().encode(`${header}.${body}`)
  );

  if (!valid) {
    throw ApiError.unauthorized("Invalid token signature");
  }

  let claims: JwtClaims;
  try {
    claims = JSON.parse(b64urlDecode(body)) as JwtClaims;
  } catch {
    throw ApiError.unauthorized("Malformed token payload");
  }

  const now = Math.floor(Date.now() / 1000);
  if (claims.exp !== undefined && now > claims.exp) {
    throw new ApiError("TOKEN_EXPIRED" as never, "Token has expired", 401);
  }
  if (claims.iss !== ISSUER) {
    throw ApiError.unauthorized("Invalid token issuer");
  }

  return claims;
}

// ─── Token creation helpers ───────────────────────────────────────────────────

export async function createAccessToken(
  sub: string,
  roles: string[] = [],
  scopes: string[] = []
): Promise<string> {
  const ttl = getTtl("JWT_ACCESS_TTL_S", 900);
  return signJwt({ sub, type: "access", roles, scopes }, ttl);
}

export async function createRefreshToken(sub: string): Promise<string> {
  const ttl = getTtl("JWT_REFRESH_TTL_S", 604_800);
  return signJwt({ sub, type: "refresh" }, ttl);
}

export async function createServiceToken(
  serviceId: string,
  scopes: string[] = []
): Promise<string> {
  return signJwt({ sub: serviceId, type: "service", scopes }, 3600);
}

// ─── Token extraction ──────────────────────────────────────────────────

export function extractBearerToken(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7).trim();
}

/**
 * Extract and verify the JWT from the Authorization header.
 * Throws `ApiError` if missing or invalid.
 */
export async function requireJwt(request: Request): Promise<JwtClaims> {
  const token = extractBearerToken(request);
  if (!token) throw ApiError.unauthorized("Missing authorization token");
  return verifyJwt(token);
}
