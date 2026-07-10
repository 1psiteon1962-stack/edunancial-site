/**
 * Stripe payment provider adapter.
 *
 * Environment variables:
 *   STRIPE_SECRET_KEY          – Stripe secret key
 *   STRIPE_WEBHOOK_SECRET      – Webhook signing secret
 *   STRIPE_ENVIRONMENT         – "live" | "test" (default: "test")
 */

import type {
  PaymentProvider,
  ProviderConfig,
  CreatePaymentIntentParams,
  PaymentIntent,
  RefundParams,
} from "../types";
import { ApiError } from "../../api/errors";

export interface StripeConfig extends ProviderConfig {
  secretKey: string;
  webhookSecret: string;
}

function getConfig(): StripeConfig {
  return {
    enabled: !!process.env.STRIPE_SECRET_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    environment: (process.env.STRIPE_ENVIRONMENT as "live" | "test") ?? "test",
  };
}

class StripeProvider implements PaymentProvider {
  readonly id = "stripe";
  readonly name = "Stripe";
  get config(): StripeConfig { return getConfig(); }

  isAvailable(): boolean {
    return !!this.config.secretKey;
  }

  private async request<T>(
    path: string,
    init: RequestInit & { body?: string }
  ): Promise<T> {
    const res = await fetch(`https://api.stripe.com/v1${path}`, {
      ...init,
      headers: {
        Authorization: "Bearer " + this.config.secretKey,
        "Content-Type": "application/x-www-form-urlencoded",
        ...(init.headers ?? {}),
      },
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ error: { message: "Stripe request failed" } }))) as {
        error?: { message: string };
      };
      throw new ApiError(
        "INTERNAL" as never,
        err.error?.message ?? "Stripe request failed",
        res.status
      );
    }

    return res.json() as Promise<T>;
  }

  async createPaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<PaymentIntent> {
    const body = new URLSearchParams({
      amount: String(params.amount),
      currency: params.currency,
      ...(params.customerId ? { customer: params.customerId } : {}),
      ...(params.description ? { description: params.description } : {}),
    });

    if (params.metadata) {
      for (const [k, v] of Object.entries(params.metadata)) {
        body.set(`metadata[${k}]`, v);
      }
    }

    const raw = await this.request<{
      id: string;
      client_secret: string;
      status: string;
      amount: number;
      currency: string;
    }>("/payment_intents", { method: "POST", body: body.toString() });

    return {
      id: raw.id,
      clientSecret: raw.client_secret,
      status: raw.status,
      amount: raw.amount,
      currency: raw.currency,
    };
  }

  async refund(params: RefundParams): Promise<{ id: string; status: string }> {
    const body = new URLSearchParams({
      payment_intent: params.paymentIntentId,
      ...(params.amount ? { amount: String(params.amount) } : {}),
      ...(params.reason ? { reason: params.reason } : {}),
    });

    const raw = await this.request<{ id: string; status: string }>(
      "/refunds",
      { method: "POST", body: body.toString() }
    );

    return { id: raw.id, status: raw.status };
  }

  async constructWebhookEvent(
    payload: string,
    signature: string
  ): Promise<{ type: string; data: unknown }> {
    // Validate Stripe webhook signature using HMAC-SHA256
    const secret = this.config.webhookSecret;
    if (!secret) throw new Error("Stripe webhook secret not configured");

    const parts = signature.split(",").reduce(
      (acc, part) => {
        const [k, v] = part.split("=");
        acc[k] = v;
        return acc;
      },
      {} as Record<string, string>
    );

    const timestamp = parts["t"];
    const sigV1 = parts["v1"];

    if (!timestamp || !sigV1) throw ApiError.unauthorized("Invalid Stripe signature header");

    const signedPayload = `${timestamp}.${payload}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const mac = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(signedPayload)
    );
    const expected = Buffer.from(mac).toString("hex");

    if (expected !== sigV1) {
      throw ApiError.unauthorized("Stripe webhook signature mismatch");
    }

    // Timestamp tolerance: 5 minutes
    const tolerance = 300;
    if (Math.abs(Date.now() / 1000 - parseInt(timestamp, 10)) > tolerance) {
      throw new ApiError("REPLAY_DETECTED" as never, "Stripe webhook timestamp too old", 400);
    }

    return JSON.parse(payload) as { type: string; data: unknown };
  }
}

export const stripeProvider = new StripeProvider();
