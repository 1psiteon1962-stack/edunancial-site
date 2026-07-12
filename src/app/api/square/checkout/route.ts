import { NextResponse } from "next/server";

import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import {
  attachRequestHeaders,
  getRequestContext,
  getRequestId,
} from "@/lib/observability/tracing";
import {
  isSquareVerifiedCheckoutEnabled,
  squareConfig,
} from "@/lib/square";

interface CheckoutRequestBody {
  id?: string;
  name?: string;
  price?: number;
  currency?: string;
}

interface SquarePaymentLinkResponse {
  payment_link?: { url?: string };
  errors?: { category: string; code: string; detail?: string }[];
}

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);

  try {
    const body = (await request.json()) as CheckoutRequestBody;
    const { id = "", name = "Plan", price = 0, currency = "USD" } = body;

    if (!isSquareVerifiedCheckoutEnabled()) {
      const response = NextResponse.json(
        {
          success: false,
          error:
            "Square checkout is disabled until verified webhook processing and fulfillment are configured.",
          requestId,
        },
        { status: 503 }
      );

      recordRequestMetric({
        method: request.method,
        route: "/api/square/checkout",
        status: 503,
        durationMs: Date.now() - start,
      });

      return attachRequestHeaders(response, requestId);
    }

    if (!id || price <= 0) {
      const response = NextResponse.json(
        { success: false, error: "A valid product and price are required.", requestId },
        { status: 400 }
      );

      recordRequestMetric({
        method: request.method,
        route: "/api/square/checkout",
        status: 400,
        durationMs: Date.now() - start,
      });

      return attachRequestHeaders(response, requestId);
    }

    const squareApiBase =
      squareConfig.environment === "sandbox"
        ? "https://connect.squareupsandbox.com"
        : "https://connect.squareup.com";

    const squareResponse = await fetch(
      `${squareApiBase}/v2/online-checkout/payment-links`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + squareConfig.accessToken,
          "Square-Version": "2024-06-04",
        },
        body: JSON.stringify({
          idempotency_key: `${requestId}-${id}`,
          quick_pay: {
            name,
            price_money: {
              amount: Math.round(price * 100),
              currency: currency.toUpperCase(),
            },
            location_id: squareConfig.locationId,
          },
        }),
      }
    );

    if (!squareResponse.ok) {
      const errBody = (await squareResponse.json().catch(() => ({}))) as SquarePaymentLinkResponse;
      const detail = errBody.errors?.[0]?.detail ?? squareResponse.statusText;
      throw new Error(`Square API error ${squareResponse.status}: ${detail}`);
    }

    const squareData = (await squareResponse.json()) as SquarePaymentLinkResponse;
    const checkoutUrl = squareData.payment_link?.url;

    if (!checkoutUrl) {
      throw new Error("Square did not return a checkout URL.");
    }

    const response = NextResponse.json({
      success: true,
      checkoutUrl,
      requestId,
    });

    recordRequestMetric({
      method: request.method,
      route: "/api/square/checkout",
      status: 200,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  } catch (error) {
    logStructuredError(error, {
      ...getRequestContext(request, requestId),
      route: "/api/square/checkout",
    });

    const response = NextResponse.json(
      { success: false, error: "Checkout request failed", requestId },
      { status: 500 }
    );

    recordRequestMetric({
      method: request.method,
      route: "/api/square/checkout",
      status: 500,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  }
}
