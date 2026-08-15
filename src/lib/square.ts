// This file is server-only. It must not be imported by client components.
// Add `server-only` to package.json dependencies to enforce this at build time.
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * @deprecated Use getSquareRuntimeConfig() or getSquareServerConfig() instead.
 * This object is kept for backward compatibility only during migration;
 * all values are read at the time of access via getters, not at import time.
 *
 * Do NOT use this in new code. Server routes must call getSquareServerConfig().
 */
export const squareConfig = {
  get applicationId() { return process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? ""; },
  get locationId() { return process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? ""; },
  get environment() { return process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT ?? "production"; },
  get accessToken() { return process.env.SQUARE_ACCESS_TOKEN ?? ""; },
  get webhookSignatureKey() { return process.env.SQUARE_WEBHOOK_SIGNATURE_KEY ?? ""; },
  get webhookNotificationUrl() { return process.env.SQUARE_WEBHOOK_NOTIFICATION_URL ?? ""; },
};

const SQUARE_WEBHOOK_API_VERSION = "2026-07-15";
const DEFAULT_PRODUCTION_WEBHOOK_URL = "https://edunancial.com/api/square/webhook";
const WEBHOOK_CACHE_TTL_MS = 5 * 60 * 1000;

const REQUIRED_WEBHOOK_EVENTS = [
  "payment.created",
  "payment.updated",
  "refund.created",
  "refund.updated",
  "subscription.created",
  "subscription.updated",
] as const;

interface SquareWebhookSubscription {
  id?: string;
  name?: string;
  enabled?: boolean;
  event_types?: string[];
  notification_url?: string;
  api_version?: string;
  signature_key?: string;
}

interface SquareWebhookListResponse {
  subscriptions?: SquareWebhookSubscription[];
  errors?: { category?: string; code?: string; detail?: string }[];
}

interface SquareWebhookResponse {
  subscription?: SquareWebhookSubscription;
  errors?: { category?: string; code?: string; detail?: string }[];
}

let managedWebhookCache:
  | { subscriptionId: string; signatureKey: string; notificationUrl: string; expiresAt: number }
  | undefined;

function getRuntimeSquareConfig() {
  return {
    applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? "",
    locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "",
    environment: process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT ?? "production",
    accessToken: process.env.SQUARE_ACCESS_TOKEN ?? "",
    webhookSignatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY ?? "",
    webhookNotificationUrl: process.env.SQUARE_WEBHOOK_NOTIFICATION_URL ?? "",
  };
}

/**
 * Returns all Square config values at runtime. Never call at module scope.
 * Server-only: secrets are included. Never pass to client components.
 */
export function getSquareServerConfig() {
  return getRuntimeSquareConfig();
}

/**
 * Returns only public/browser-safe Square config values (no secrets).
 */
export function getSquareRuntimeConfig() {
  const config = getRuntimeSquareConfig();
  return {
    applicationId: config.applicationId,
    locationId: config.locationId,
    environment: config.environment,
  };
}

/**
 * Returns a readiness diagnostic object with only boolean/string indicators —
 * never secret values. Safe to log internally (not to expose to end users).
 */
export function getSquareReadinessDiagnostics() {
  const config = getRuntimeSquareConfig();
  const env = config.environment;
  const isProduction = env === "production";
  const isSandbox = env === "sandbox";

  return {
    hasApplicationId: config.applicationId.length > 0,
    hasLocationId: config.locationId.length > 0,
    hasAccessToken: config.accessToken.length > 0,
    hasWebhookSignatureKey: config.webhookSignatureKey.length > 0,
    hasWebhookNotificationUrl: config.webhookNotificationUrl.length > 0,
    environment: env,
    isProduction,
    isSandbox,
    isConfigured:
      config.applicationId.length > 0 &&
      config.locationId.length > 0 &&
      config.accessToken.length > 0,
  };
}

/**
 * Caches credential validation result for a short window to avoid
 * unnecessary Square API calls on rapid checkout requests.
 */
let credentialValidationCache:
  | { valid: boolean; missingVarNames: string[]; expiresAt: number }
  | undefined;
const CREDENTIAL_VALIDATION_TTL_MS = 2 * 60 * 1000;

/**
 * Performs a live Square API call to validate access token and location.
 * Fail-closed: returns invalid on any error. Does not expose secret values.
 */
export async function validateSquareCredentials(options?: { forceRefresh?: boolean }): Promise<{
  valid: boolean;
  missingVarNames: string[];
  errorMessage?: string;
}> {
  const config = getRuntimeSquareConfig();
  const missing: string[] = [];
  if (!config.applicationId) missing.push("NEXT_PUBLIC_SQUARE_APPLICATION_ID");
  if (!config.locationId) missing.push("NEXT_PUBLIC_SQUARE_LOCATION_ID");
  if (!config.accessToken) missing.push("SQUARE_ACCESS_TOKEN");

  if (missing.length > 0) {
    return { valid: false, missingVarNames: missing, errorMessage: `Missing configuration: ${missing.join(", ")}` };
  }

  // Production environment must not fall back to sandbox.
  const env = config.environment;
  if (env !== "production" && env !== "sandbox") {
    return {
      valid: false,
      missingVarNames: [],
      errorMessage: `NEXT_PUBLIC_SQUARE_ENVIRONMENT has unexpected value "${env}". Must be "production" or "sandbox".`,
    };
  }

  if (
    !options?.forceRefresh &&
    credentialValidationCache &&
    credentialValidationCache.expiresAt > Date.now()
  ) {
    return {
      valid: credentialValidationCache.valid,
      missingVarNames: credentialValidationCache.missingVarNames,
    };
  }

  try {
    const apiBase = getSquareApiBase(env);
    const response = await fetch(
      `${apiBase}/v2/locations/${encodeURIComponent(config.locationId)}`,
      {
        headers: {
          Authorization: "Bearer " + config.accessToken,
          "Square-Version": SQUARE_WEBHOOK_API_VERSION,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (response.status === 401 || response.status === 403) {
      credentialValidationCache = { valid: false, missingVarNames: [], expiresAt: Date.now() + CREDENTIAL_VALIDATION_TTL_MS };
      return { valid: false, missingVarNames: [], errorMessage: "Square access token is not valid or lacks required permissions." };
    }

    if (response.status === 404) {
      credentialValidationCache = { valid: false, missingVarNames: [], expiresAt: Date.now() + CREDENTIAL_VALIDATION_TTL_MS };
      return { valid: false, missingVarNames: [], errorMessage: "Square location ID is not found or not accessible." };
    }

    if (!response.ok) {
      credentialValidationCache = { valid: false, missingVarNames: [], expiresAt: Date.now() + CREDENTIAL_VALIDATION_TTL_MS };
      return { valid: false, missingVarNames: [], errorMessage: `Square credential validation returned status ${response.status}.` };
    }

    // Verify environment consistency: sandbox tokens must not work against production and vice versa.
    const body = (await response.json().catch(() => ({}))) as { location?: { status?: string } };
    if (!body.location) {
      credentialValidationCache = { valid: false, missingVarNames: [], expiresAt: Date.now() + CREDENTIAL_VALIDATION_TTL_MS };
      return { valid: false, missingVarNames: [], errorMessage: "Square did not return location data." };
    }

    credentialValidationCache = { valid: true, missingVarNames: [], expiresAt: Date.now() + CREDENTIAL_VALIDATION_TTL_MS };
    return { valid: true, missingVarNames: [] };
  } catch {
    credentialValidationCache = { valid: false, missingVarNames: [], expiresAt: Date.now() + CREDENTIAL_VALIDATION_TTL_MS };
    return { valid: false, missingVarNames: [], errorMessage: "Square credential validation failed due to network or configuration error." };
  }
}

/** Reset credential validation cache — for use in tests only. */
export function resetSquareCredentialCacheForTests() {
  credentialValidationCache = undefined;
}

function getSquareApiBase(environment: string) {
  return environment === "sandbox"
    ? "https://connect.squareupsandbox.com"
    : "https://connect.squareup.com";
}

export function getSquareWebhookNotificationUrl() {
  const config = getRuntimeSquareConfig();
  if (config.webhookNotificationUrl.trim()) {
    return config.webhookNotificationUrl.trim();
  }

  return DEFAULT_PRODUCTION_WEBHOOK_URL;
}

function webhookErrorDetail(payload: {
  errors?: { detail?: string; code?: string }[];
}) {
  return payload.errors?.[0]?.detail || payload.errors?.[0]?.code || "Unknown Square webhook API error";
}

async function squareWebhookRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const config = getRuntimeSquareConfig();
  if (!config.accessToken) {
    throw new Error("SQUARE_ACCESS_TOKEN is not configured.");
  }

  const response = await fetch(`${getSquareApiBase(config.environment)}${path}`, {
    ...init,
    headers: {
      Authorization: "Bearer " + config.accessToken,
      "Content-Type": "application/json",
      "Square-Version": SQUARE_WEBHOOK_API_VERSION,
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as T & {
    errors?: { detail?: string; code?: string }[];
  };

  if (!response.ok) {
    throw new Error(
      `Square webhook API ${response.status}: ${webhookErrorDetail(payload)}`
    );
  }

  return payload;
}

function hasRequiredEvents(subscription: SquareWebhookSubscription) {
  const events = new Set(subscription.event_types || []);
  return REQUIRED_WEBHOOK_EVENTS.every((eventType) => events.has(eventType));
}

async function retrieveWebhookSubscription(subscriptionId: string) {
  const payload = await squareWebhookRequest<SquareWebhookResponse>(
    `/v2/webhooks/subscriptions/${encodeURIComponent(subscriptionId)}`
  );

  if (!payload.subscription?.id) {
    throw new Error("Square did not return the webhook subscription.");
  }

  return payload.subscription;
}

export async function ensureSquareWebhookSubscription() {
  const config = getRuntimeSquareConfig();
  if (!validateSquareConfig()) {
    throw new Error("Square application, location, or access-token configuration is incomplete.");
  }

  const notificationUrl = getSquareWebhookNotificationUrl();

  if (
    managedWebhookCache &&
    managedWebhookCache.notificationUrl === notificationUrl &&
    managedWebhookCache.expiresAt > Date.now()
  ) {
    return managedWebhookCache;
  }

  const listPayload = await squareWebhookRequest<SquareWebhookListResponse>(
    "/v2/webhooks/subscriptions?include_disabled=true"
  );

  let subscription = (listPayload.subscriptions || []).find(
    (candidate) => candidate.notification_url === notificationUrl
  );

  if (!subscription?.id) {
    const createPayload = await squareWebhookRequest<SquareWebhookResponse>(
      "/v2/webhooks/subscriptions",
      {
        method: "POST",
        body: JSON.stringify({
          idempotency_key: `edunancial-webhook-${config.environment}`,
          subscription: {
            name: "Edunancial Production Payments",
            enabled: true,
            event_types: [...REQUIRED_WEBHOOK_EVENTS],
            notification_url: notificationUrl,
            api_version: SQUARE_WEBHOOK_API_VERSION,
          },
        }),
      }
    );
    subscription = createPayload.subscription;
  } else if (!subscription.enabled || !hasRequiredEvents(subscription)) {
    const updatePayload = await squareWebhookRequest<SquareWebhookResponse>(
      `/v2/webhooks/subscriptions/${encodeURIComponent(subscription.id)}`,
      {
        method: "PUT",
        body: JSON.stringify({
          subscription: {
            name: subscription.name || "Edunancial Production Payments",
            enabled: true,
            event_types: [...REQUIRED_WEBHOOK_EVENTS],
            notification_url: notificationUrl,
            api_version: subscription.api_version || SQUARE_WEBHOOK_API_VERSION,
          },
        }),
      }
    );
    subscription = updatePayload.subscription;
  }

  if (!subscription?.id) {
    throw new Error("Square webhook subscription could not be created or resolved.");
  }

  if (!subscription.signature_key) {
    subscription = await retrieveWebhookSubscription(subscription.id);
  }

  const subscriptionId = subscription.id;
  if (!subscriptionId) {
    throw new Error("Square webhook subscription id is missing after retrieval.");
  }

  const signatureKey =
    subscription.signature_key || config.webhookSignatureKey.trim();

  if (!signatureKey) {
    throw new Error("Square webhook subscription has no signature key.");
  }

  managedWebhookCache = {
    subscriptionId,
    signatureKey,
    notificationUrl,
    expiresAt: Date.now() + WEBHOOK_CACHE_TTL_MS,
  };

  return managedWebhookCache;
}

export function getSquareCheckoutUrl(checkoutUrl: string) {
  return checkoutUrl;
}

export function validateSquareConfig() {
  const config = getRuntimeSquareConfig();

  return (
    config.applicationId.length > 0 &&
    config.locationId.length > 0 &&
    config.accessToken.length > 0
  );
}

export function hasSquareWebhookVerificationConfig() {
  const config = getRuntimeSquareConfig();
  return (
    (config.webhookSignatureKey.length > 0 &&
      getSquareWebhookNotificationUrl().length > 0) ||
    validateSquareConfig()
  );
}

export function isSquareVerifiedCheckoutEnabled() {
  return validateSquareConfig();
}

function verifySignatureWithKey(
  body: string,
  signatureHeader: string | null,
  signatureKey: string,
  notificationUrl: string
) {
  if (!signatureHeader || !signatureKey || !notificationUrl) {
    return false;
  }

  const expectedSignature = createHmac("sha256", signatureKey)
    .update(`${notificationUrl}${body}`)
    .digest("base64");

  const provided = Buffer.from(signatureHeader.trim());
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(provided, expected);
}

/**
 * Synchronous verifier retained for unit tests and explicit environment-based
 * webhook setups. Production webhook handling uses the managed async verifier
 * below so the signature key can be retrieved from Square directly.
 */
export function verifySquareWebhookSignature(
  body: string,
  signatureHeader: string | null
) {
  const config = getRuntimeSquareConfig();
  return verifySignatureWithKey(
    body,
    signatureHeader,
    config.webhookSignatureKey,
    getSquareWebhookNotificationUrl()
  );
}

export async function verifyManagedSquareWebhookSignature(
  body: string,
  signatureHeader: string | null
) {
  const managed = await ensureSquareWebhookSubscription();
  return verifySignatureWithKey(
    body,
    signatureHeader,
    managed.signatureKey,
    managed.notificationUrl
  );
}

export function resetManagedSquareWebhookCacheForTests() {
  managedWebhookCache = undefined;
}
