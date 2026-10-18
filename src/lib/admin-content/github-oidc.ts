import { createPublicKey, verify as verifySignature } from "node:crypto";

/**
 * Cryptographic verification of GitHub Actions OIDC identity tokens.
 *
 * A workflow GITHUB_TOKEN plus a run ID is NOT proof of caller identity: run
 * metadata for a public repository is readable by unrelated GitHub users. Only
 * a JWT signed by GitHub's OIDC issuer, minted for our audience, and bound to
 * this repository / branch / workflow file proves the request comes from an
 * authorized runner. Every failure path returns null (fail closed).
 */
export const GITHUB_OIDC_ISSUER = "https://token.actions.githubusercontent.com";
export const DEFAULT_GITHUB_OIDC_AUDIENCE = "https://edunancial.com/api/admin";
const JWKS_URL = `${GITHUB_OIDC_ISSUER}/.well-known/jwks`;
const CLOCK_SKEW_SECONDS = 60;
/** GitHub OIDC tokens are short-lived; reject anything claiming a long lifetime. */
const MAX_TOKEN_LIFETIME_SECONDS = 60 * 60;
const JWKS_TTL_MS = 10 * 60_000;
/** Unknown-kid refetches are rate-limited so forged tokens cannot amplify traffic to GitHub. */
const JWKS_REFETCH_COOLDOWN_MS = 60_000;
const MAX_TOKEN_LENGTH = 16_384;

export type Jwk = { kid?: string; kty?: string; alg?: string; use?: string; n?: string; e?: string; [key: string]: unknown };
export type JwksFetcher = () => Promise<{ keys: Jwk[] }>;

export type GithubOidcClaims = {
  iss: string;
  aud: string | string[];
  sub: string;
  exp: number;
  nbf?: number;
  iat?: number;
  repository: string;
  repository_id?: string;
  ref: string;
  event_name: string;
  run_id?: string;
  workflow_ref?: string;
  job_workflow_ref?: string;
};

export type GithubOidcPolicy = {
  audience: string;
  /** owner/repo */
  repository: string;
  /** Optional numeric repository ID; enforced when provided (defends against a deleted-and-recreated repo name). */
  repositoryId?: string;
  /** e.g. refs/heads/main */
  ref: string;
  /** e.g. .github/workflows/production-curriculum-audit.yml */
  workflowPath: string;
  allowedEvents: readonly string[];
  /** When provided, the signed run_id claim must equal it. */
  runId?: string;
  nowSeconds?: number;
};

let jwksCache: { at: number; keys: Jwk[] } | null = null;
let lastRefetchAt = 0;

const defaultFetcher: JwksFetcher = async () => {
  const response = await fetch(JWKS_URL, { cache: "no-store", signal: AbortSignal.timeout(5_000) });
  if (!response.ok) throw new Error(`GitHub OIDC JWKS unavailable (HTTP ${response.status}).`);
  return response.json() as Promise<{ keys: Jwk[] }>;
};

function decodeSegment<T>(segment: string): T {
  if (!/^[A-Za-z0-9_-]+$/.test(segment)) throw new Error("Malformed JWT segment.");
  return JSON.parse(Buffer.from(segment, "base64url").toString("utf8")) as T;
}

async function keyFor(kid: string, fetcher: JwksFetcher): Promise<Jwk | null> {
  const now = Date.now();
  const fresh = jwksCache !== null && now - jwksCache.at < JWKS_TTL_MS;
  const cached = fresh ? jwksCache!.keys.find((k) => k.kid === kid) : undefined;
  if (cached) return cached;
  // Stale cache, or an unknown kid that may be legitimate key rotation: refetch,
  // but never more than once per cooldown window while the cache is fresh.
  if (fresh && now - lastRefetchAt < JWKS_REFETCH_COOLDOWN_MS) return null;
  lastRefetchAt = now;
  const { keys } = await fetcher();
  jwksCache = { at: now, keys: Array.isArray(keys) ? keys : [] };
  return jwksCache.keys.find((k) => k.kid === kid) ?? null;
}

/** Returns verified claims, or null for ANY malformed, unverifiable, or non-matching token. */
export async function verifyGithubOidcToken(
  token: string,
  policy: GithubOidcPolicy,
  fetcher: JwksFetcher = defaultFetcher,
): Promise<GithubOidcClaims | null> {
  try {
    if (!policy.audience || !policy.repository || !policy.ref || !policy.workflowPath || !policy.allowedEvents.length) return null;
    if (typeof token !== "string" || !token || token.length > MAX_TOKEN_LENGTH) return null;
    const parts = token.split(".");
    if (parts.length !== 3 || parts.some((part) => !part)) return null;

    const header = decodeSegment<{ alg?: string; kid?: string; crit?: unknown }>(parts[0]!);
    // Pin the algorithm: never accept "none", HMAC, or anything the token chooses.
    if (header.alg !== "RS256" || typeof header.kid !== "string" || !header.kid || header.crit !== undefined) return null;

    const jwk = await keyFor(header.kid, fetcher);
    if (!jwk || jwk.kty !== "RSA" || (jwk.alg !== undefined && jwk.alg !== "RS256") || (jwk.use !== undefined && jwk.use !== "sig")) return null;
    const key = createPublicKey({ key: { kty: "RSA", n: jwk.n, e: jwk.e } as never, format: "jwk" });
    const signature = Buffer.from(parts[2]!, "base64url");
    if (!verifySignature("RSA-SHA256", Buffer.from(`${parts[0]}.${parts[1]}`), key, signature)) return null;

    const claims = decodeSegment<GithubOidcClaims>(parts[1]!);
    const now = policy.nowSeconds ?? Math.floor(Date.now() / 1000);
    if (claims.iss !== GITHUB_OIDC_ISSUER) return null;
    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!audiences.includes(policy.audience)) return null;
    if (typeof claims.exp !== "number" || now >= claims.exp + CLOCK_SKEW_SECONDS) return null;
    if (claims.nbf !== undefined && (typeof claims.nbf !== "number" || claims.nbf - CLOCK_SKEW_SECONDS > now)) return null;
    if (claims.iat !== undefined && (typeof claims.iat !== "number" || claims.iat - CLOCK_SKEW_SECONDS > now)) return null;
    if (typeof claims.iat === "number" && claims.exp - claims.iat > MAX_TOKEN_LIFETIME_SECONDS) return null;

    if (claims.repository !== policy.repository || claims.ref !== policy.ref) return null;
    if (policy.repositoryId && claims.repository_id !== policy.repositoryId) return null;
    if (!policy.allowedEvents.includes(claims.event_name)) return null;
    if (policy.runId !== undefined && String(claims.run_id ?? "") !== policy.runId) return null;

    // workflow_ref must name our workflow file on our branch. job_workflow_ref is
    // documented for jobs that run inside a reusable workflow and may be absent on
    // ordinary jobs; when it IS present it must name the same file, so a reusable
    // workflow from another repository can never borrow our identity.
    const expectedWorkflow = `${policy.repository}/${policy.workflowPath}@${policy.ref}`;
    if (claims.workflow_ref !== expectedWorkflow) return null;
    if (claims.job_workflow_ref !== undefined && claims.job_workflow_ref !== expectedWorkflow) return null;
    return claims;
  } catch {
    return null;
  }
}

export function resetGithubOidcCacheForTests(): void {
  jwksCache = null;
  lastRefetchAt = 0;
}
