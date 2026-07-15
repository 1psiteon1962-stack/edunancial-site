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
import { enforcePaymentRateLimit } from "@/lib/payments/rateLimiter";
import {
  membershipPlans,
  resolveMembershipPlanId,
} from "@/types/membership";

interface CheckoutRequestBody {
  id?: string;
  name?: string;
  price?: number;
  currency?: string;
  memberEmail?: string;
}

interface SquarePaymentLinkResponse {
  payment_link?: { url?: string };
  errors?: { category: string; code: string; detail?: string }[];
}

function isAllowedSquareCheckoutHost(hostname: string) {
  return (
    hostname === "squareup.com" ||
    hostname.endsWith(".squareup.com") ||
    hostname === "squareupsandbox.com" ||
    hostname.endsWith(".squareupsandbox.com")
  );
}

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);

  try {
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimit = enforcePaymentRateLimit({
      scope: "square-checkout",
      key: ipAddress,
      maxRequests: 20,
      windowMs: 60_000,
    });

    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        {
          success: false,
          error: "Too many checkout requests. Please wait and retry.",
          requestId,
        },
        { status: 429 }
      );

      response.headers.set("Retry-After", Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString());

      recordRequestMetric({
        method: request.method,
        route: "/api/square/checkout",
        status: 429,
        durationMs: Date.now() - start,
      });

      return attachRequestHeaders(response, requestId);
    }

    const body = (await request.json()) as CheckoutRequestBody;
    const { id = "", price = 0, currency = "USD", memberEmail } = body;
    const canonicalPlanId = resolveMembershipPlanId(id);
    const plan = membershipPlans.find((candidate) => candidate.id === canonicalPlanId);

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

    if (!id || !plan) {
      const response = NextResponse.json(
        { success: false, error: "A valid membership plan is required.", requestId },
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

    if (plan.id === "beta" && !plan.isPublic) {
      const response = NextResponse.json(
        {
          success: false,
          error: "Trial Membership checkout is currently disabled.",
          requestId,
        },
        { status: 403 }
      );

      recordRequestMetric({
        method: request.method,
        route: "/api/square/checkout",
        status: 403,
        durationMs: Date.now() - start,
      });

      return attachRequestHeaders(response, requestId);
    }

    const publishedPrice = Number(plan.monthlyPrice.toFixed(2));
    const priceMatches = Number(price.toFixed(2)) === publishedPrice;
    const currencyMatches = currency.toUpperCase() === plan.currency.toUpperCase();

    if (!priceMatches || !currencyMatches || plan.monthlyPrice <= 0) {
      const response = NextResponse.json(
        {
          success: false,
          error:
            "Published membership pricing mismatch. Use the canonical membership plan price and currency.",
          requestId,
        },
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

    const appOrigin = new URL(request.url).origin;

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
            name: `${plan.name}`,
            price_money: {
              amount: Math.round(plan.monthlyPrice * 100),
              currency: plan.currency.toUpperCase(),
            },
            location_id: squareConfig.locationId,
          },
          checkout_options: {
            redirect_url: `${appOrigin}/payment/success?plan=${plan.id}`,
          },
          pre_populated_data: memberEmail ? { buyer_email: memberEmail } : undefined,
          metadata: {
            membership_plan_id: plan.id,
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

    const parsedCheckoutUrl = new URL(checkoutUrl);
    if (
      parsedCheckoutUrl.protocol !== "https:" ||
      !isAllowedSquareCheckoutHost(parsedCheckoutUrl.hostname)
    ) {
      throw new Error("Square returned a non-HTTPS or unexpected checkout URL.");
    }

    const response = NextResponse.json({
      success: true,
      checkoutUrl,
      planId: plan.id,
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
