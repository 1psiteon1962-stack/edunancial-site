/**
 * PayPal payment provider adapter.
 *
 * Environment variables:
 *   PAYPAL_CLIENT_ID      – PayPal app client ID
 *   PAYPAL_CLIENT_SECRET  – PayPal app client secret
 *   PAYPAL_ENVIRONMENT    – "sandbox" | "live" (default: "sandbox")
 */

import type {
  PaymentProvider,
  ProviderConfig,
  CreatePaymentIntentParams,
  PaymentIntent,
  RefundParams,
} from "../types";

export interface PayPalConfig extends ProviderConfig {
  clientId: string;
  clientSecret: string;
}

function getConfig(): PayPalConfig {
  return {
    enabled: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
    clientId: process.env.PAYPAL_CLIENT_ID ?? "",
    clientSecret: process.env.PAYPAL_CLIENT_SECRET ?? "",
    environment: (process.env.PAYPAL_ENVIRONMENT as "sandbox" | "live") ?? "sandbox",
  };
}

class PayPalProvider implements PaymentProvider {
  readonly id = "paypal";
  readonly name = "PayPal";
  get config(): PayPalConfig { return getConfig(); }

  private baseUrl(): string {
    return this.config.environment === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";
  }

  isAvailable(): boolean {
    return !!(this.config.clientId && this.config.clientSecret);
  }

  private async getAccessToken(): Promise<string> {
    const creds = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`
    ).toString("base64");

    const res = await fetch(`${this.baseUrl()}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const json = (await res.json()) as { access_token: string };
    return json.access_token;
  }

  async createPaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<PaymentIntent> {
    const token = await this.getAccessToken();
    const amountDecimal = (params.amount / 100).toFixed(2);

    const res = await fetch(`${this.baseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: params.currency.toUpperCase(), value: amountDecimal },
            description: params.description,
          },
        ],
      }),
    });

    const order = (await res.json()) as { id: string; status: string };
    return {
      id: order.id,
      status: order.status,
      amount: params.amount,
      currency: params.currency,
    };
  }

  async refund(params: RefundParams): Promise<{ id: string; status: string }> {
    const token = await this.getAccessToken();
    const res = await fetch(
      `${this.baseUrl()}/v2/payments/captures/${params.paymentIntentId}/refund`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: params.amount
          ? JSON.stringify({ amount: { value: (params.amount / 100).toFixed(2), currency_code: "USD" } })
          : "{}",
      }
    );

    const refund = (await res.json()) as { id: string; status: string };
    return { id: refund.id, status: refund.status };
  }

  async constructWebhookEvent(
    payload: string,
    _signature: string
  ): Promise<{ type: string; data: unknown }> {
    // PayPal webhook verification requires calling their verify endpoint.
    // In production, call https://api-m.paypal.com/v1/notifications/verify-webhook-signature
    const parsed = JSON.parse(payload) as { event_type: string };
    return { type: parsed.event_type, data: parsed };
  }
}

export const paypalProvider = new PayPalProvider();
