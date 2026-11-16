import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stripe Checkout adapter (no SDK; plain HTTPS calls to the Stripe API).
 *
 * Purpose: charge the exact local-currency price a visitor sees in markets the
 * US Square account cannot settle (Square only charges in the account
 * country's currency). Canada (CAD) is the first such market.
 *
 * Safety: OFF unless ALL of these are set in the hosting environment:
 *   EDUNANCIAL_STRIPE_CHECKOUT_ENABLED=true
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET
 * Prices are never invented here: callers pass the approved local price.
 */

export { STRIPE_CHECKOUT_COUNTRIES, isStripeCheckoutCountry } from "@/lib/payments/stripe-countries";

export function getStripeReadiness() {
  return {
    flagEnabled: process.env.EDUNANCIAL_STRIPE_CHECKOUT_ENABLED === "true",
    secretKeyConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    webhookSecretConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim()),
  };
}

export function isStripeCheckoutEnabled(): boolean {
  const readiness = getStripeReadiness();
  return readiness.flagEnabled && readiness.secretKeyConfigured && readiness.webhookSecretConfigured;
}

export function isAllowedStripeCheckoutHost(hostname: string): boolean {
  return hostname === "checkout.stripe.com";
}

/** Two-decimal currencies only (CAD, USD, EUR, ...). Zero-decimal currencies are rejected until needed. */
const ZERO_DECIMAL = new Set(["BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA", "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF"]);

export function toStripeMinorUnits(amount: number, currency: string): number {
  const code = currency.trim().toUpperCase();
  if (ZERO_DECIMAL.has(code)) throw new Error(`Zero-decimal currency ${code} is not supported by this adapter yet.`);
  if (!(amount > 0) || !Number.isFinite(amount)) throw new Error("Stripe amount must be a positive number.");
  return Math.round(amount * 100);
}

export interface StripeCheckoutInput {
  itemId: string;
  itemName: string;
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  idempotencyKey: string;
  metadata: Record<string, string>;
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
  amountTotal: number | null;
  currency: string | null;
}

export async function createStripeCheckoutSession(input: StripeCheckoutInput): Promise<StripeCheckoutSession> {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) throw new Error("Stripe secret key is not configured.");

  const currency = input.currency.trim().toLowerCase();
  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("success_url", input.successUrl);
  form.set("cancel_url", input.cancelUrl);
  form.set("line_items[0][quantity]", "1");
  form.set("line_items[0][price_data][currency]", currency);
  form.set("line_items[0][price_data][unit_amount]", String(toStripeMinorUnits(input.amount, input.currency)));
  form.set("line_items[0][price_data][product_data][name]", input.itemName);
  form.set("client_reference_id", input.itemId);
  if (input.customerEmail?.trim()) form.set("customer_email", input.customerEmail.trim());
  for (const [key, value] of Object.entries(input.metadata)) {
    form.set(`metadata[${key}]`, value);
    form.set(`payment_intent_data[metadata][${key}]`, value);
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Idempotency-Key": input.idempotencyKey,
    },
    body: form.toString(),
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as {
    id?: string;
    url?: string;
    amount_total?: number;
    currency?: string;
    error?: { message?: string };
  };
  if (!response.ok) throw new Error(`Stripe API error ${response.status}: ${payload.error?.message ?? response.statusText}`);
  if (!payload.id || !payload.url) throw new Error("Stripe did not return a checkout session URL.");
  const parsed = new URL(payload.url);
  if (parsed.protocol !== "https:" || !isAllowedStripeCheckoutHost(parsed.hostname)) {
    throw new Error("Stripe returned a non-HTTPS or unexpected checkout URL.");
  }
  return {
    id: payload.id,
    url: payload.url,
    amountTotal: typeof payload.amount_total === "number" ? payload.amount_total : null,
    currency: payload.currency ?? null,
  };
}

/**
 * Verify a Stripe-Signature header (t=timestamp, v1=HMAC-SHA256 of "t.payload").
 * Rejects events older than the tolerance window to block replays.
 */
export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string | undefined = process.env.STRIPE_WEBHOOK_SECRET,
  toleranceSeconds = 300,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  if (!signatureHeader || !secret?.trim()) return false;
  let timestamp: number | null = null;
  const signatures: string[] = [];
  for (const part of signatureHeader.split(",")) {
    const [key, value] = part.split("=", 2).map((piece) => piece?.trim());
    if (key === "t" && value && /^\d+$/u.test(value)) timestamp = Number(value);
    if (key === "v1" && value && /^[0-9a-f]{64}$/iu.test(value)) signatures.push(value.toLowerCase());
  }
  if (timestamp === null || signatures.length === 0) return false;
  if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) return false;
  const expected = createHmac("sha256", secret.trim()).update(`${timestamp}.${rawBody}`, "utf8").digest();
  return signatures.some((candidate) => {
    const provided = Buffer.from(candidate, "hex");
    return provided.length === expected.length && timingSafeEqual(provided, expected);
  });
}
