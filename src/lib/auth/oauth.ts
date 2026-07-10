/**
 * OAuth 2.0 readiness interfaces and flow scaffolding.
 *
 * Full provider setup is deferred, but the interfaces, grant-type handling,
 * and PKCE helpers are defined so future OAuth integration is a drop-in.
 *
 * Supported grant types (scaffolded):
 *   - authorization_code (+ PKCE)
 *   - refresh_token
 *   - client_credentials (service-to-service)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type OAuthGrantType =
  | "authorization_code"
  | "refresh_token"
  | "client_credentials";

export interface OAuthProvider {
  id: string;
  name: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl?: string;
  scopes: string[];
}

export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: "Bearer";
  expires_in: number;
  scope?: string;
}

export interface OAuthClient {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

// ─── PKCE helpers ─────────────────────────────────────────────────────────────

/**
 * Generate a cryptographically random PKCE code verifier (43-128 chars).
 */
export function generateCodeVerifier(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(64));
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Derive the code challenge from a verifier using S256 method.
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier)
  );
  return Buffer.from(hash)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Build an authorization URL for the OAuth 2.0 authorization code flow.
 */
export function buildAuthorizationUrl(
  provider: OAuthProvider,
  client: OAuthClient,
  state: string,
  codeChallenge?: string
): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: client.clientId,
    redirect_uri: client.redirectUri,
    scope: client.scopes.join(" "),
    state,
  });

  if (codeChallenge) {
    params.set("code_challenge", codeChallenge);
    params.set("code_challenge_method", "S256");
  }

  return `${provider.authorizationUrl}?${params.toString()}`;
}

// ─── State management (in-memory — replace with encrypted cookie or session) ──

const stateStore = new Map<string, { createdAt: number; verifier?: string }>();

export function generateOAuthState(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const state = Buffer.from(bytes).toString("hex");
  stateStore.set(state, { createdAt: Date.now() });
  return state;
}

export function validateOAuthState(state: string): boolean {
  const entry = stateStore.get(state);
  if (!entry) return false;
  stateStore.delete(state);
  const ageMs = Date.now() - entry.createdAt;
  return ageMs < 600_000; // 10-minute window
}

// ─── Provider registry ────────────────────────────────────────────────────────

const providers = new Map<string, OAuthProvider>();

export function registerOAuthProvider(provider: OAuthProvider): void {
  providers.set(provider.id, provider);
}

export function getOAuthProvider(id: string): OAuthProvider | undefined {
  return providers.get(id);
}

export function listOAuthProviders(): OAuthProvider[] {
  return [...providers.values()];
}
