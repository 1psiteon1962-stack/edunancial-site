import type { AuthRole } from "./roles";

const encoder = new TextEncoder();

export type SessionClaims = {
  sub: string;
  email: string;
  role: AuthRole;
  sid: string;
  iat: number;
  exp: number;
};

type JwtHeader = {
  alg: "HS256";
  typ: "JWT";
};

function base64UrlEncode(input: string | Uint8Array): string {
  const bytes = typeof input === "string" ? encoder.encode(input) : input;
  let binary = "";

  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}

function parseJson<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "development-only-auth-secret-change-me"
  );
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return base64UrlEncode(new Uint8Array(signature));
}

export async function signSessionToken(claims: SessionClaims): Promise<string> {
  const header: JwtHeader = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(claims));
  const content = `${encodedHeader}.${encodedPayload}`;
  const signature = await sign(content, getAuthSecret());
  return `${content}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<SessionClaims | null> {
  if (!token) {
    return null;
  }

  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null;
  }

  const content = `${encodedHeader}.${encodedPayload}`;
  const secret = getAuthSecret();
  const expectedSignature = await sign(content, secret);

  if (expectedSignature !== encodedSignature) {
    return null;
  }

  const header = parseJson<JwtHeader>(base64UrlDecode(encodedHeader));
  const payload = parseJson<SessionClaims>(base64UrlDecode(encodedPayload));

  if (!header || !payload || header.alg !== "HS256" || header.typ !== "JWT") {
    return null;
  }

  if (payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}
