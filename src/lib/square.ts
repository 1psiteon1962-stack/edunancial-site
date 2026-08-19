// This file is server-only. It must not be imported by client components.
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * @deprecated Use getSquareRuntimeConfig() or getSquareServerConfig() instead.
 * All values are read at access time so serverless runtimes never depend on
 * environment values captured during module initialization.
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
const CREDENTIAL_VALIDATION_TTL_MS = 2 * 60 * 1000;

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

let credentialValidationCache:
  | { valid: boolean; missingVarNames: string[]; errorMessage?: string; expiresAt: number }
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

/** Server-only Square config. Never return this object to the browser. */
export function getSquareServerConfig() {
  return getRuntimeSquareConfig();
}

/** Browser-safe Square config. No access token or webhook key is included. */
export function getSquareRuntimeConfig() {
  const config = getRuntimeSquareConfig();
  return {
    applicationId: config.applicationId,
    locationId: config.locationId,
    environment: config.environment,
  };
}

/** Safe readiness indicators. Secret values are never exposed. */
export function getSquareReadinessDiagnostics() {
  const config = getRuntimeSquareConfig();
  const isProduction = config.environment === "production";
  const isSandbox = config.environment === "sandbox";
  const environmentValid = isProduction || isSandbox;

  return {
    hasApplicationId: config.applicationId.length > 0,
    hasLocationId: config.locationId.length > 0,
    hasAccessToken: config.accessToken.length > 0,
    hasWebhookSignatureKey: config.webhookSignatureKey.length > 0,
    hasWebhookNotificationUrl: getSquareWebhookNotificationUrl().length > 0,
    environment: config.environment,
    isProduction,
    isSandbox,
    environmentValid,
    isConfigured:
      environmentValid &&
      config.applicationId.length > 0 &&
      config.locationId.length > 0 &&
      config.accessToken.length > 0,
  };
}

function getSquareApiBase(environment: string) {
  if (environment === "sandbox") return "https://connect.squareupsandbox.com";
  if (environment === "production") return "https://connect.squareup.com";
  throw new Error("NEXT_PUBLIC_SQUARE_ENVIRONMENT must be production or sandbox.");
}

/**
 * Validate the production token/location against Square itself before checkout.
 * This fails closed and returns only sanitized diagnostic information.
 */
export async function validateSquareCredentials(options?: { forceRefresh?: boolean }): Promise<{
  valid: boolean;
  missingVarNames: string[];
  errorMessage?: string;
}> {
  const config = getRuntimeSquareConfig();
  const missingVarNames: string[] = [];
  if (!config.applicationId) missingVarNames.push("NEXT_PUBLIC_SQUARE_APPLICATION_ID");
  if (!config.locationId) missingVarNames.push("NEXT_PUBLIC_SQUARE_LOCATION_ID");
  if (!config.accessToken) missingVarNames.push("SQUARE_ACCESS_TOKEN");

  if (missingVarNames.length > 0) {
    return {
      valid: false,
      missingVarNames,
      errorMessage: `Missing configuration: ${missingVarNames.join(", ")}`,
    };
  }

  if (config.environment !== "production" && config.environment !== "sandbox") {
    return {
      valid: false,
      missingVarNames: [],
      errorMessage: "NEXT_PUBLIC_SQUARE_ENVIRONMENT must be production or sandbox.",
    };
  }

  if (!options?.forceRefresh && credentialValidationCache?.expiresAt && credentialValidationCache.expiresAt > Date.now()) {
    return {
      valid: credentialValidationCache.valid,
      missingVarNames: credentialValidationCache.missingVarNames,
      errorMessage: credentialValidationCache.errorMessage,
    };
  }

  try {
    const response = await fetch(
      `${getSquareApiBase(config.environment)}/v2/locations/${encodeURIComponent(config.locationId)}`,
      {
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
          "Square-Version": SQUARE_WEBHOOK_API_VERSION,
        },
        cache: "no-store",
      },
    );

    let errorMessage: string | undefined;
    if (response.status === 401 || response.status === 403) {
      errorMessage = "Square access token is invalid or lacks required permissions.";
    } else if (response.status === 404) {
      errorMessage = "Square location ID is not accessible with the configured token.";
    } else if (!response.ok) {
      errorMessage = `Square credential validation returned status ${response.status}.`;
    } else {
      const payload = (await response.json().catch(() => ({}))) as { location?: unknown };
      if (!payload.location) errorMessage = "Square did not return the configured location.";
    }

    const valid = !errorMessage;
    credentialValidationCache = {
      valid,
      missingVarNames: [],
      errorMessage,
      expiresAt: Date.now() + CREDENTIAL_VALIDATION_TTL_MS,
    };
    return { valid, missingVarNames: [], errorMessage };
  } catch {
    const errorMessage = "Square credential validation failed due to a network or configuration error.";
    credentialValidationCache = {
      valid: false,
      missingVarNames: [],
      errorMessage,
      expiresAt: Date.now() + CREDENTIAL_VALIDATION_TTL_MS,
    };
    return { valid: false, missingVarNames: [], errorMessage };
  }
}

export function resetSquareCredentialCacheForTests() {
  credentialValidationCache = undefined;
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

async function squareWebhookRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = getRuntimeSquareConfig();
  if (!config.accessToken) {
    throw new Error("SQUARE_ACCESS_TOKEN is not configured.");
  }

  const response = await fetch(`${getSquareApiBase(config.environment)}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
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
    throw new Error(`Square webhook API ${response.status}: ${webhookErrorDetail(payload)}`);
  }
  return payload;
}

function hasRequiredEvents(subscription: SquareWebhookSubscription) {
  const events = new Set(subscription.event_types || []);
  return REQUIRED_WEBHOOK_EVENTS.every((eventType) => events.has(eventType));
}

async function retrieveWebhookSubscription(subscriptionId: string) {
  const payload = await squareWebhookRequest<SquareWebhookResponse>(
    `/v2/webhooks/subscriptions/${encodeURIComponent(subscriptionId)}`,
  );
  if (!payload.subscription?.id) {
    throw new Error("Square did not return the webhook subscription.");
  }
  return payload.subscription;
}

export async function ensureSquareWebhookSubscription(): Promise<{
  subscriptionId: string;
  signatureKey: string;
  notificationUrl: string;
  expiresAt: number;
}> {
  const config = getRuntimeSquareConfig();
  if (!validateSquareConfig()) {
    throw new Error("Square application, location, access-token, or environment configuration is incomplete.");
  }

  const notificationUrl = getSquareWebhookNotificationUrl();

  // A manually configured signature key is a valid production setup and must
  // not require webhook-management permissions on the Square access token.
  if (config.webhookSignatureKey.trim()) {
    return {
      subscriptionId: "configured-via-env",
      signatureKey: config.webhookSignatureKey.trim(),
      notificationUrl,
      expiresAt: Date.now() + WEBHOOK_CACHE_TTL_MS,
    };
  }

  if (
    managedWebhookCache &&
    managedWebhookCache.notificationUrl === notificationUrl &&
    managedWebhookCache.expiresAt > Date.now()
  ) {
    return managedWebhookCache;
  }

  const listPayload = await squareWebhookRequest<SquareWebhookListResponse>(
    "/v2/webhooks/subscriptions?include_disabled=true",
  );

  let subscription = (listPayload.subscriptions || []).find(
    (candidate) => candidate.notification_url === notificationUrl,
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
      },
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
      },
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
  const signatureKey = subscription.signature_key;
  if (!subscriptionId || !signatureKey) {
    throw new Error("Square webhook subscription is missing an id or signature key.");
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
    (config.environment === "production" || config.environment === "sandbox") &&
    config.applicationId.length > 0 &&
    config.locationId.length > 0 &&
    config.accessToken.length > 0
  );
}

export function hasSquareWebhookVerificationConfig() {
  const config = getRuntimeSquareConfig();
  return (
    (config.webhookSignatureKey.length > 0 && getSquareWebhookNotificationUrl().length > 0) ||
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
  notificationUrl: string,
) {
  if (!signatureHeader || !signatureKey || !notificationUrl) {
    return false;
  }

  const expectedSignature = createHmac("sha256", signatureKey)
    .update(`${notificationUrl}${body}`)
    .digest("base64");

  const provided = Buffer.from(signatureHeader.trim());
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}

export function verifySquareWebhookSignature(body: string, signatureHeader: string | null) {
  const config = getRuntimeSquareConfig();
  return verifySignatureWithKey(
    body,
    signatureHeader,
    config.webhookSignatureKey,
    getSquareWebhookNotificationUrl(),
  );
}

export async function verifyManagedSquareWebhookSignature(
  body: string,
  signatureHeader: string | null,
) {
  const config = getRuntimeSquareConfig();
  if (config.webhookSignatureKey.trim()) {
    return verifySignatureWithKey(
      body,
      signatureHeader,
      config.webhookSignatureKey.trim(),
      getSquareWebhookNotificationUrl(),
    );
  }

  const managed = await ensureSquareWebhookSubscription();
  return verifySignatureWithKey(
    body,
    signatureHeader,
    managed.signatureKey,
    managed.notificationUrl,
  );
}

export function resetManagedSquareWebhookCacheForTests() {
  managedWebhookCache = undefined;
}
