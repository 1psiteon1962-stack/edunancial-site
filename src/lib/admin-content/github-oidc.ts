import { createPublicKey, verify as verifySignature } from "node:crypto";

/**
 * Verify GitHub Actions OIDC before exposing read-only curriculum backups.
 * GitHub workflow run IDs and workflow GITHUB_TOKENs alone are NOT authorization:
 * run metadata of a public repository can be read by unrelated GitHub users.
 */
export const GITHUB_OIDC_ISSUER = "https://token.actions.githubusercontent.com";
const JWKS_URL = GITHUB_OIDC_ISSUER + "/.well-known/jwks";
const CLOCK_SKEW_SECONDS = 60;
const JWKS_TTL_MS = 10 * 60_000;
type Jwk = { kid?: string; kty?: string; alg?: string; n?: string; e?: string; use?: string; [key: string]: unknown };
export type JwksFetcher = () => Promise<{ keys: Jwk[] }>;
export type GithubOidcClaims = {
  iss: string; aud: string | string[]; sub: string; exp: number; nbf?: number; iat?: number;
  repository: string; ref: string; event_name: string; job_workflow_ref?: string; workflow_ref?: string;
};
export type GithubOidcPolicy = {
  audience: string;
  repository: string;
  ref: string;
  workflowPath: string;
  allowedEvents: readonly string[];
  nowSeconds?: number;
};

let jwksCache: { at: number; keys: Jwk[] } | null = null;
const defaultFetcher: JwksFetcher = async () => {
  const response = await fetch(JWKS_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("GitHub OIDC JWKS unavailable (HTTP " + response.status + ").");
  return response.json() as Promise<{ keys: Jwk[] }>;
};

function decodeSegment<T>(segment: string): T {
  return JSON.parse(Buffer.from(segment, "base64url").toString("utf8")) as T;
}

async function keyFor(kid: string, fetcher: JwksFetcher): Promise<Jwk | null> {
  const fresh = jwksCache && Date.now() - jwksCache.at < JWKS_TTL_MS;
  let key = fresh ? jwksCache!.keys.find((k) => k.kid === kid) : undefined;
  if (!key) {
    // An unknown kid can be legitimate key rotation; refetch JWKS once.
    const { keys } = await fetcher();
    jwksCache = { at: Date.now(), keys: Array.isArray(keys) ? keys : [] };
    key = jwksCache.keys.find((k) => k.kid === kid);
  }
  return key ?? null;
}

/** Fail closed for malformed tokens, unknown keys, bad signatures or claims. */
export async function verifyGithubOidcToken(
  token: string,
  policy: GithubOidcPolicy,
  fetcher: JwksFetcher = defaultFetcher,
): Promise<GithubOidcClaims | null> {
  try {
    if (!token || token.length > 16384) return null;
    const parts = token.split(".");
    if (parts.length !== 3 || parts.some((part) => !part)) return null;
    const header = decodeSegment<{ alg?: string; kid?: string; typ?: string }>(parts[0]!);
    if (header.alg !== "RS256" || !header.kid) return null;
    const jwk = await keyFor(header.kid, fetcher);
    if (!jwk || jwk.kty !== "RSA") return null;
    const signed = Buffer.from(parts[0] + "." + parts[1]);
    const key = createPublicKey({ key: jwk as never, format: "jwk" });
    if (!verifySignature("RSA-SHA256", signed, key, Buffer.from(parts[2]!, "base64url"))) return null;
    const claims = decodeSegment<GithubOidcClaims>(parts[1]!);
    const now = policy.nowSeconds ?? Math.floor(Date.now() / 1000);
    if (claims.iss !== GITHUB_OIDC_ISSUER) return null;
    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!audiences.includes(policy.audience)) return null;
    if (typeof claims.exp !== "number" || claims.exp + CLOCK_SKEW_SECONDS < now) return null;
    if (typeof claims.nbf === "number" && claims.nbf - CLOCK_SKEW_SECONDS > now) return null;
    if (claims.repository !== policy.repository || claims.ref !== policy.ref) return null;
    if (!policy.allowedEvents.includes(claims.event_name)) return null;
    const expectedWorkflow = policy.repository + "/" + policy.workflowPath + "@" + policy.ref;
    if (claims.job_workflow_ref !== expectedWorkflow && claims.workflow_ref !== expectedWorkflow) return null;
    return claims;
  } catch {
    return null;
  }
}

export function resetGithubOidcCacheForTests(): void { jwksCache = null; }
