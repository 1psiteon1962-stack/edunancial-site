import { NextResponse } from "next/server";
import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";
import { squareConfig, validateSquareConfig } from "@/lib/square";

interface CheckoutRequestBody {
  id?: string;
  name?: string;
  price?: number;
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
    const { id = "", name = "Plan", price = 0 } = body;

    let checkoutUrl: string;

    if (validateSquareConfig()) {
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
            Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN ?? ""}`,
            "Square-Version": "2024-06-04",
          },
          body: JSON.stringify({
            idempotency_key: `${requestId}-${id}`,
            quick_pay: {
              name,
              price_money: {
                amount: Math.round(price * 100),
                currency: "USD",
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
      checkoutUrl = squareData.payment_link?.url ?? `/checkout?product=${id}`;
    } else {
      // Square credentials not configured — return safe placeholder URL
      checkoutUrl = `/checkout?product=${id}`;
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
