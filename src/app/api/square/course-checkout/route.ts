import { NextResponse } from "next/server";

import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import {
  attachRequestHeaders,
  getRequestContext,
  getRequestId,
} from "@/lib/observability/tracing";
import { isSquareVerifiedCheckoutEnabled, squareConfig } from "@/lib/square";
import { enforcePaymentRateLimit } from "@/lib/payments/rateLimiter";

interface CourseCheckoutRequestBody {
  courseId?: string;
  courseName?: string;
  price?: number;
  currency?: string;
  customerEmail?: string;
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
      scope: "square-course-checkout",
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
      response.headers.set(
        "Retry-After",
        Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString()
      );
      recordRequestMetric({
        method: request.method,
        route: "/api/square/course-checkout",
        status: 429,
        durationMs: Date.now() - start,
      });
      return attachRequestHeaders(response, requestId);
    }

    const body = (await request.json()) as CourseCheckoutRequestBody;
    const {
      courseId = "",
      courseName = "",
      price = 0,
      currency = "USD",
      customerEmail,
    } = body;

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
        route: "/api/square/course-checkout",
        status: 503,
        durationMs: Date.now() - start,
      });
      return attachRequestHeaders(response, requestId);
    }

    if (!courseId || !courseName) {
      const response = NextResponse.json(
        {
          success: false,
          error: "courseId and courseName are required.",
          requestId,
        },
        { status: 400 }
      );
      recordRequestMetric({
        method: request.method,
        route: "/api/square/course-checkout",
        status: 400,
        durationMs: Date.now() - start,
      });
      return attachRequestHeaders(response, requestId);
    }

    const priceInCents = Math.round(price * 100);
    if (priceInCents <= 0) {
      const response = NextResponse.json(
        {
          success: false,
          error: "Course price must be greater than zero.",
          requestId,
        },
        { status: 400 }
      );
      recordRequestMetric({
        method: request.method,
        route: "/api/square/course-checkout",
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
          idempotency_key: `${requestId}-course-${courseId}`,
          quick_pay: {
            name: courseName,
            price_money: {
              amount: priceInCents,
              currency: currency.toUpperCase(),
            },
            location_id: squareConfig.locationId,
          },
          checkout_options: {
            redirect_url: `${appOrigin}/payment/success?course=${courseId}`,
          },
          pre_populated_data: customerEmail
            ? { buyer_email: customerEmail }
            : undefined,
          metadata: {
            course_id: courseId,
            course_name: courseName,
          },
        }),
      }
    );

    if (!squareResponse.ok) {
      const errBody = (await squareResponse
        .json()
        .catch(() => ({}))) as SquarePaymentLinkResponse;
      const detail =
        errBody.errors?.[0]?.detail ?? squareResponse.statusText;
      throw new Error(`Square API error ${squareResponse.status}: ${detail}`);
    }

    const squareData =
      (await squareResponse.json()) as SquarePaymentLinkResponse;
    const checkoutUrl = squareData.payment_link?.url;

    if (!checkoutUrl) {
      throw new Error("Square did not return a checkout URL.");
    }

    const parsedCheckoutUrl = new URL(checkoutUrl);
    if (
      parsedCheckoutUrl.protocol !== "https:" ||
      !isAllowedSquareCheckoutHost(parsedCheckoutUrl.hostname)
    ) {
      throw new Error(
        "Square returned a non-HTTPS or unexpected checkout URL."
      );
    }

    const response = NextResponse.json({
      success: true,
      checkoutUrl,
      courseId,
      requestId,
    });

    recordRequestMetric({
      method: request.method,
      route: "/api/square/course-checkout",
      status: 200,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  } catch (error) {
    logStructuredError(error, {
      ...getRequestContext(request, requestId),
      route: "/api/square/course-checkout",
    });

    const response = NextResponse.json(
      {
        success: false,
        error: "Course checkout request failed",
        requestId,
      },
      { status: 500 }
    );

    recordRequestMetric({
      method: request.method,
      route: "/api/square/course-checkout",
      status: 500,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  }
}
