import { NextResponse } from "next/server";

import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";
import { ensureSquareWebhookSubscription, isSquareVerifiedCheckoutEnabled, squareConfig } from "@/lib/square";
import { enforcePaymentRateLimit } from "@/lib/payments/rateLimiter";
import { resolveCatalogItem } from "@/lib/payments/catalog";
import { hasPaymentPersistenceConfig, persistCheckoutInitiation } from "@/lib/payments/persistence";
import { membershipPlans, resolveMembershipPlanId } from "@/types/membership";

interface CheckoutRequestBody {
  id?: string;
  price?: number;
  currency?: string;
  memberEmail?: string;
}

interface SquarePaymentLinkResponse {
  payment_link?: { url?: string; id?: string; order_id?: string };
  errors?: { category: string; code: string; detail?: string }[];
}

function isAllowedSquareCheckoutHost(hostname: string) {
  return hostname === "squareup.com" || hostname.endsWith(".squareup.com") || hostname === "square.link" || hostname.endsWith(".square.link") || hostname === "squareupsandbox.com" || hostname.endsWith(".squareupsandbox.com");
}

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);
  const route = "/api/square/checkout";

  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const rateLimit = enforcePaymentRateLimit({ scope: "square-checkout", key: ipAddress, maxRequests: 20, windowMs: 60_000 });
    if (!rateLimit.allowed) {
      const response = NextResponse.json({ success: false, error: "Too many checkout requests. Please wait and retry.", requestId }, { status: 429 });
      response.headers.set("Retry-After", Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString());
      recordRequestMetric({ method: request.method, route, status: 429, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    if (!isSquareVerifiedCheckoutEnabled() || !hasPaymentPersistenceConfig()) {
      const response = NextResponse.json({ success: false, error: "Square production checkout is not fully configured.", requestId }, { status: 503 });
      recordRequestMetric({ method: request.method, route, status: 503, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    await ensureSquareWebhookSubscription();

    const body = (await request.json()) as CheckoutRequestBody;
    const { id = "", price = 0, currency = "USD", memberEmail } = body;
    const canonicalPlanId = resolveMembershipPlanId(id);
    const plan = membershipPlans.find((candidate) => candidate.id === canonicalPlanId);
    const item = canonicalPlanId ? resolveCatalogItem(canonicalPlanId) : undefined;

    if (!id || !canonicalPlanId || !plan || !item?.membershipPlanId) {
      return attachRequestHeaders(NextResponse.json({ success: false, error: "A valid membership plan is required.", requestId }, { status: 400 }), requestId);
    }
    if (plan.id === "beta" && !plan.isPublic) {
      return attachRequestHeaders(NextResponse.json({ success: false, error: "Trial Membership checkout is currently disabled.", requestId }, { status: 403 }), requestId);
    }
    if (!memberEmail?.trim()) {
      return attachRequestHeaders(NextResponse.json({ success: false, error: "Sign in with a verified member email before checkout.", requestId }, { status: 401 }), requestId);
    }

    const publishedPrice = Number(plan.monthlyPrice.toFixed(2));
    const priceMatches = Number(price.toFixed(2)) === publishedPrice;
    const currencyMatches = currency.toUpperCase() === plan.currency.toUpperCase();
    if (!priceMatches || !currencyMatches || plan.monthlyPrice <= 0 || item.price !== publishedPrice) {
      return attachRequestHeaders(NextResponse.json({ success: false, error: "Published membership pricing mismatch. Use the canonical membership plan price and currency.", requestId }, { status: 400 }), requestId);
    }

    const squareApiBase = squareConfig.environment === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
    const appOrigin = new URL(request.url).origin;
    const idempotencyKey = `${requestId}-${item.id}`;
    const squareResponse = await fetch(`${squareApiBase}/v2/online-checkout/payment-links`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + squareConfig.accessToken, "Square-Version": "2026-07-15" },
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        order: {
          location_id: squareConfig.locationId,
          line_items: [{ name: item.name, quantity: "1", base_price_money: { amount: Math.round(item.price * 100), currency: item.currency.toUpperCase() } }],
          metadata: { catalog_item_id: item.id, item_type: item.type, membership_plan_id: item.membershipPlanId },
        },
        checkout_options: { redirect_url: `${appOrigin}/payment/success?item=${item.id}&type=${item.type}&plan=${item.membershipPlanId}` },
        pre_populated_data: { buyer_email: memberEmail.trim().toLowerCase() },
      }),
    });

    if (!squareResponse.ok) {
      const errBody = (await squareResponse.json().catch(() => ({}))) as SquarePaymentLinkResponse;
      throw new Error(`Square API error ${squareResponse.status}: ${errBody.errors?.[0]?.detail ?? squareResponse.statusText}`);
    }

    const squareData = (await squareResponse.json()) as SquarePaymentLinkResponse;
    const checkoutUrl = squareData.payment_link?.url;
    if (!checkoutUrl) throw new Error("Square did not return a checkout URL.");
    const parsedCheckoutUrl = new URL(checkoutUrl);
    if (parsedCheckoutUrl.protocol !== "https:" || !isAllowedSquareCheckoutHost(parsedCheckoutUrl.hostname)) throw new Error("Square returned a non-HTTPS or unexpected checkout URL.");

    await persistCheckoutInitiation({
      item,
      customerEmail: memberEmail,
      amountRequested: item.price,
      currency: item.currency,
      squarePaymentLinkId: squareData.payment_link?.id,
      squareOrderId: squareData.payment_link?.order_id,
      idempotencyKey,
      metadata: { requestId, membershipPlanId: item.membershipPlanId },
    });

    const response = NextResponse.json({ success: true, checkoutUrl, planId: plan.id, squareOrderId: squareData.payment_link?.order_id, requestId });
    recordRequestMetric({ method: request.method, route, status: 200, durationMs: Date.now() - start });
    return attachRequestHeaders(response, requestId);
  } catch (error) {
    logStructuredError(error, { ...getRequestContext(request, requestId), route });
    const response = NextResponse.json({ success: false, error: "Checkout request failed", requestId }, { status: 500 });
    recordRequestMetric({ method: request.method, route, status: 500, durationMs: Date.now() - start });
    return attachRequestHeaders(response, requestId);
  }
}
