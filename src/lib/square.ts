import { createHmac, timingSafeEqual } from "node:crypto";

export interface SquareRuntimeConfig {
  applicationId: string;
  locationId: string;
  environment: string;
  accessToken: string;
  webhookSignatureKey: string;
  webhookNotificationUrl: string;
}

export function getRuntimeSquareConfig(): SquareRuntimeConfig {
  return {
    applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || "",
    locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "",
    environment: process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || "production",
    accessToken: process.env.SQUARE_ACCESS_TOKEN || "",
    webhookSignatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || "",
    webhookNotificationUrl: process.env.SQUARE_WEBHOOK_NOTIFICATION_URL || "",
  };
}

// Backward-compatible view for callers that only render configuration metadata.
// Payment execution should call getRuntimeSquareConfig() at request time.
export const squareConfig = getRuntimeSquareConfig();

const SQUARE_WEBHOOK_API_VERSION = "2026-07-15";
const DEFAULT_PRODUCTION_WEBHOOK_URL = "https://edunancial.com/api/square/webhook";
const WEBHOOK_CACHE_TTL_MS = 5 * 60 * 1000;

const REQUIRED_WEBHOOK_EVENTS = ["payment.created","payment.updated","refund.created","refund.updated","subscription.created","subscription.updated"] as const;
interface SquareWebhookSubscription { id?: string; name?: string; enabled?: boolean; event_types?: string[]; notification_url?: string; api_version?: string; signature_key?: string; }
interface SquareWebhookListResponse { subscriptions?: SquareWebhookSubscription[]; errors?: { category?: string; code?: string; detail?: string }[]; }
interface SquareWebhookResponse { subscription?: SquareWebhookSubscription; errors?: { category?: string; code?: string; detail?: string }[]; }
let managedWebhookCache: { subscriptionId: string; signatureKey: string; notificationUrl: string; expiresAt: number } | undefined;
function getSquareApiBase(environment: string) { return environment === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com"; }
export function getSquareWebhookNotificationUrl() { const config=getRuntimeSquareConfig(); return config.webhookNotificationUrl.trim() || DEFAULT_PRODUCTION_WEBHOOK_URL; }
function webhookErrorDetail(payload:{errors?:{detail?:string;code?:string}[]}){return payload.errors?.[0]?.detail||payload.errors?.[0]?.code||"Unknown Square webhook API error";}
async function squareWebhookRequest<T>(path:string,init:RequestInit={}):Promise<T>{const config=getRuntimeSquareConfig();if(!config.accessToken)throw new Error("SQUARE_ACCESS_TOKEN is not configured.");const response=await fetch(`${getSquareApiBase(config.environment)}${path}`,{...init,headers:{Authorization:"Bearer "+config.accessToken,"Content-Type":"application/json","Square-Version":SQUARE_WEBHOOK_API_VERSION,...(init.headers||{})},cache:"no-store"});const payload=(await response.json().catch(()=>({}))) as T&{errors?:{detail?:string;code?:string}[]};if(!response.ok)throw new Error(`Square webhook API ${response.status}: ${webhookErrorDetail(payload)}`);return payload;}
function hasRequiredEvents(subscription:SquareWebhookSubscription){const events=new Set(subscription.event_types||[]);return REQUIRED_WEBHOOK_EVENTS.every((eventType)=>events.has(eventType));}
async function retrieveWebhookSubscription(subscriptionId:string){const payload=await squareWebhookRequest<SquareWebhookResponse>(`/v2/webhooks/subscriptions/${encodeURIComponent(subscriptionId)}`);if(!payload.subscription?.id)throw new Error("Square did not return the webhook subscription.");return payload.subscription;}
export async function ensureSquareWebhookSubscription():Promise<{subscriptionId:string;signatureKey:string;notificationUrl:string;expiresAt:number}>{const config=getRuntimeSquareConfig();if(!validateSquareConfig())throw new Error("Square application, location, or access-token configuration is incomplete.");const notificationUrl=getSquareWebhookNotificationUrl();if(config.webhookSignatureKey.trim())return {subscriptionId:"configured-via-env",signatureKey:config.webhookSignatureKey.trim(),notificationUrl,expiresAt:Date.now()+WEBHOOK_CACHE_TTL_MS};if(managedWebhookCache&&managedWebhookCache.notificationUrl===notificationUrl&&managedWebhookCache.expiresAt>Date.now())return managedWebhookCache;const listPayload=await squareWebhookRequest<SquareWebhookListResponse>("/v2/webhooks/subscriptions?include_disabled=true");let subscription=(listPayload.subscriptions||[]).find((candidate)=>candidate.notification_url===notificationUrl);if(!subscription?.id){const createPayload=await squareWebhookRequest<SquareWebhookResponse>("/v2/webhooks/subscriptions",{method:"POST",body:JSON.stringify({idempotency_key:`edunancial-webhook-${config.environment}`,subscription:{name:"Edunancial Production Payments",enabled:true,event_types:[...REQUIRED_WEBHOOK_EVENTS],notification_url:notificationUrl,api_version:SQUARE_WEBHOOK_API_VERSION}})});subscription=createPayload.subscription;}else if(!subscription.enabled||!hasRequiredEvents(subscription)){const updatePayload=await squareWebhookRequest<SquareWebhookResponse>(`/v2/webhooks/subscriptions/${encodeURIComponent(subscription.id)}`,{method:"PUT",body:JSON.stringify({subscription:{name:subscription.name||"Edunancial Production Payments",enabled:true,event_types:[...REQUIRED_WEBHOOK_EVENTS],notification_url:notificationUrl,api_version:subscription.api_version||SQUARE_WEBHOOK_API_VERSION}})});subscription=updatePayload.subscription;}if(!subscription?.id)throw new Error("Square webhook subscription could not be created or resolved.");if(!subscription.signature_key)subscription=await retrieveWebhookSubscription(subscription.id);const subscriptionId=subscription.id;if(!subscriptionId)throw new Error("Square webhook subscription id is missing after retrieval.");const signatureKey=subscription.signature_key||config.webhookSignatureKey.trim();if(!signatureKey)throw new Error("Square webhook subscription has no signature key.");managedWebhookCache={subscriptionId,signatureKey,notificationUrl,expiresAt:Date.now()+WEBHOOK_CACHE_TTL_MS};return managedWebhookCache;}
export function getSquareCheckoutUrl(checkoutUrl:string){return checkoutUrl;}
export function validateSquareConfig(){const config=getRuntimeSquareConfig();return config.applicationId.length>0&&config.locationId.length>0&&config.accessToken.length>0;}
export function getSquareReadiness(){const config=getRuntimeSquareConfig();return {configured:validateSquareConfig(),environment:config.environment,applicationIdConfigured:Boolean(config.applicationId),locationIdConfigured:Boolean(config.locationId),accessTokenConfigured:Boolean(config.accessToken),webhookSignatureConfigured:Boolean(config.webhookSignatureKey),webhookNotificationUrlConfigured:Boolean(config.webhookNotificationUrl||DEFAULT_PRODUCTION_WEBHOOK_URL)};}
export function hasSquareWebhookVerificationConfig(){const config=getRuntimeSquareConfig();return (config.webhookSignatureKey.length>0&&getSquareWebhookNotificationUrl().length>0)||validateSquareConfig();}
export function isSquareVerifiedCheckoutEnabled(){return validateSquareConfig();}
function verifySignatureWithKey(body:string,signatureHeader:string|null,signatureKey:string,notificationUrl:string){if(!signatureHeader||!signatureKey||!notificationUrl)return false;const expectedSignature=createHmac("sha256",signatureKey).update(`${notificationUrl}${body}`).digest("base64");const provided=Buffer.from(signatureHeader.trim());const expected=Buffer.from(expectedSignature);if(provided.length!==expected.length)return false;return timingSafeEqual(provided,expected);}
export function verifySquareWebhookSignature(body:string,signatureHeader:string|null){const config=getRuntimeSquareConfig();return verifySignatureWithKey(body,signatureHeader,config.webhookSignatureKey,getSquareWebhookNotificationUrl());}
export async function verifyManagedSquareWebhookSignature(body:string,signatureHeader:string|null){const config=getRuntimeSquareConfig();if(config.webhookSignatureKey.trim())return verifySignatureWithKey(body,signatureHeader,config.webhookSignatureKey.trim(),getSquareWebhookNotificationUrl());const managed=await ensureSquareWebhookSubscription();return verifySignatureWithKey(body,signatureHeader,managed.signatureKey,managed.notificationUrl);}
export function resetManagedSquareWebhookCacheForTests(){managedWebhookCache=undefined;}
