/**
 * Unified Square Payment Link API
 */

import { NextResponse } from "next/server";

import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";
import { ensureSquareWebhookSubscription, isSquareVerifiedCheckoutEnabled, squareConfig } from "@/lib/square";
import { enforcePaymentRateLimit } from "@/lib/payments/rateLimiter";
import { resolveCatalogItem } from "@/lib/payments/catalog";
import { applyDiscountCode, recordDiscountRedemption } from "@/lib/payments/discounts";
import { assertCountryOperationAllowed } from "@/lib/regions/runtime-controls";
import { resolveCheckoutTax } from "@/lib/tax/checkout-tax";

interface PaymentLinkRequestBody {
  itemId?: string;
  discountCode?: string;
  customerEmail?: string;
  countryCode?: string;
  subdivisionCode?: string;
  postalCode?: string;
  city?: string;
}

interface SquarePaymentLinkResponse {
  payment_link?: { url?: string; id?: string; order_id?: string };
  errors?: { category: string; code: string; detail?: string }[];
}

function isAllowedSquareCheckoutHost(hostname: string): boolean {
  return hostname === "squareup.com" || hostname.endsWith(".squareup.com") || hostname === "square.link" || hostname.endsWith(".square.link") || hostname === "squareupsandbox.com" || hostname.endsWith(".squareupsandbox.com");
}

function inferNorthAmericaCountry(currency: string): "US" | "CA" {
  return currency.trim().toUpperCase() === "CAD" ? "CA" : "US";
}

function squareTaxLineItemEnabled(): boolean {
  return process.env.EDUNANCIAL_SQUARE_TAX_LINE_ITEM_ENABLED === "true";
}

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);
  const route = "/api/square/payment-link";

  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const rateLimit = enforcePaymentRateLimit({ scope: "square-payment-link", key: ipAddress, maxRequests: 20, windowMs: 60_000 });

    if (!rateLimit.allowed) {
      const response = NextResponse.json({ success: false, error: "Too many checkout requests. Please wait and retry.", requestId }, { status: 429 });
      response.headers.set("Retry-After", Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString());
      recordRequestMetric({ method: request.method, route, status: 429, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    if (!isSquareVerifiedCheckoutEnabled()) {
      const response = NextResponse.json({ success: false, error: "Square production credentials are not fully configured.", requestId }, { status: 503 });
      recordRequestMetric({ method: request.method, route, status: 503, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    await ensureSquareWebhookSubscription();

    const body = (await request.json()) as PaymentLinkRequestBody;
    const { itemId = "", discountCode, customerEmail } = body;
    if (!itemId) return attachRequestHeaders(NextResponse.json({ success: false, error: "itemId is required.", requestId }, { status: 400 }), requestId);

    const item = resolveCatalogItem(itemId);
    if (!item) return attachRequestHeaders(NextResponse.json({ success: false, error: "The requested item is not available for purchase.", requestId }, { status: 400 }), requestId);
    if (!item.active) return attachRequestHeaders(NextResponse.json({ success: false, error: "This item is not currently available for purchase.", requestId }, { status: 403 }), requestId);

    const countryCode = body.countryCode?.trim().toUpperCase() || inferNorthAmericaCountry(item.currency);
    let countryControl;
    try {
      countryControl = await assertCountryOperationAllowed(countryCode, ["ACTIVE", "BETA"]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Checkout is not enabled for this country.";
      const response = NextResponse.json({ success: false, error: message, countryCode, requestId }, { status: 403 });
      recordRequestMetric({ method: request.method, route, status: 403, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    if (countryControl.countryCode !== "US" && countryControl.countryCode !== "CA") {
      const response = NextResponse.json({
        success: false,
        error: `Country ${countryControl.countryCode} is enabled, but Square is not an approved payment provider for this market.`,
        countryCode: countryControl.countryCode,
        paymentProvider: "square",
        requestId,
      }, { status: 409 });
      recordRequestMetric({ method: request.method, route, status: 409, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    let finalPrice = item.price;
    let discountApplied = false;
    let discountDescription: string | undefined;
    if (discountCode?.trim()) {
      const discountResult = applyDiscountCode(discountCode, item.id, item.price, item.currency);
      if (!discountResult.valid) return attachRequestHeaders(NextResponse.json({ success: false, error: discountResult.errorMessage ?? "Invalid discount code.", requestId }, { status: 400 }), requestId);
      finalPrice = Math.max(0, discountResult.finalPrice);
      discountApplied = true;
      discountDescription = discountResult.code?.description;
    }

    const subtotalMinor = Math.round(finalPrice * 100);
    const taxResolution = await resolveCheckoutTax({
      countryCode: countryControl.countryCode,
      subdivisionCode: body.subdivisionCode,
      postalCode: body.postalCode,
      city: body.city,
      itemType: item.type,
      subtotalMinor,
      currency: item.currency,
    });

    if (taxResolution.status === "location-required") {
      const response = NextResponse.json({ success: false, error: taxResolution.reason, taxStatus: taxResolution.status, requestId }, { status: 422 });
      recordRequestMetric({ method: request.method, route, status: 422, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    if (taxResolution.status === "manual-review-required") {
      const response = NextResponse.json({
        success: false,
        error: taxResolution.decision.quote.reason,
        taxStatus: taxResolution.status,
        jurisdictionKey: taxResolution.decision.quote.jurisdictionKey,
        requestId,
      }, { status: 409 });
      recordRequestMetric({ method: request.method, route, status: 409, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    const taxDecision = taxResolution.decision;
    const taxMinor = taxDecision.quote.tax.amountMinor;
    if (taxMinor > 0 && !squareTaxLineItemEnabled()) {
      const response = NextResponse.json({
        success: false,
        error: "Tax was calculated, but Square tax charging is not yet enabled for this deployment. Checkout is blocked to prevent under-collection.",
        taxStatus: "charge-adapter-disabled",
        taxMinor,
        currency: item.currency.toUpperCase(),
        jurisdictionKey: taxDecision.quote.jurisdictionKey,
        requestId,
      }, { status: 503 });
      recordRequestMetric({ method: request.method, route, status: 503, durationMs: Date.now() - start });
      return attachRequestHeaders(response, requestId);
    }

    const squareApiBase = squareConfig.environment === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
    const appOrigin = new URL(request.url).origin;
    const currency = item.currency.toUpperCase();
    const lineItems: Array<Record<string, unknown>> = [
      { name: item.name, quantity: "1", base_price_money: { amount: Math.round(item.price * 100), currency } },
    ];
    if (taxMinor > 0) {
      lineItems.push({
        name: `Tax — ${taxDecision.quote.jurisdictionKey}`,
        quantity: "1",
        base_price_money: { amount: taxMinor, currency },
      });
    }

    const orderDiscounts = discountApplied ? [{ name: discountDescription ?? "Promotional Discount", type: "FIXED_AMOUNT", amount_money: { amount: Math.round((item.price - finalPrice) * 100), currency } }] : undefined;
    const successParams = new URLSearchParams({ item: item.id, type: item.type, country: countryControl.countryCode, ...(item.membershipPlanId ? { plan: item.membershipPlanId } : {}), ...(item.contentId ? { content: item.contentId } : {}) });

    const squarePayload: Record<string, unknown> = {
      idempotency_key: `${requestId}-${item.id}`,
      order: {
        location_id: squareConfig.locationId,
        line_items: lineItems,
        ...(orderDiscounts ? { discounts: orderDiscounts } : {}),
        metadata: {
          catalog_item_id: item.id,
          item_type: item.type,
          country_code: countryControl.countryCode,
          country_launch_state: countryControl.launchState,
          tax_collected_minor: String(taxMinor),
          tax_jurisdiction_code: body.subdivisionCode?.trim().toUpperCase() || taxDecision.quote.jurisdictionKey,
          tax_rule_version: taxDecision.ruleVersion ?? taxDecision.quote.ruleVersionId ?? "",
          tax_registration_account_ref: taxDecision.registrationAccountRef ?? "",
          tax_status: taxDecision.quote.status ?? "calculated",
          ...(item.membershipPlanId ? { membership_plan_id: item.membershipPlanId } : {}),
          ...(item.contentId ? { content_id: item.contentId } : {}),
          ...(discountCode ? { discount_code: discountCode } : {}),
          ...(item.metadata ?? {}),
        },
      },
      checkout_options: { redirect_url: `${appOrigin}/payment/success?${successParams.toString()}` },
      pre_populated_data: customerEmail ? { buyer_email: customerEmail } : undefined,
    };

    const squareResponse = await fetch(`${squareApiBase}/v2/online-checkout/payment-links`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + squareConfig.accessToken, "Square-Version": "2026-07-15" },
      body: JSON.stringify(squarePayload),
    });

    if (!squareResponse.ok) {
      const errBody = (await squareResponse.json().catch(() => ({}))) as SquarePaymentLinkResponse;
      throw new Error(`Square API error ${squareResponse.status}: ${errBody.errors?.[0]?.detail ?? squareResponse.statusText}`);
    }

    const squareData = (await squareResponse.json()) as SquarePaymentLinkResponse;
    const checkoutUrl = squareData.payment_link?.url;
    if (!checkoutUrl) throw new Error("Square did not return a checkout URL.");
    const parsedUrl = new URL(checkoutUrl);
    if (parsedUrl.protocol !== "https:" || !isAllowedSquareCheckoutHost(parsedUrl.hostname)) throw new Error("Square returned a non-HTTPS or unexpected checkout URL.");

    if (discountApplied && discountCode) recordDiscountRedemption(discountCode);

    const response = NextResponse.json({
      success: true,
      checkoutUrl,
      countryCode: countryControl.countryCode,
      jurisdictionKey: taxDecision.quote.jurisdictionKey,
      taxMinor,
      taxCurrency: currency,
      itemId: item.id,
      itemType: item.type,
      planId: item.membershipPlanId,
      contentId: item.contentId,
      originalPrice: item.price,
      finalPrice,
      discountApplied,
      squarePaymentLinkId: squareData.payment_link?.id,
      squareOrderId: squareData.payment_link?.order_id,
      requestId,
    });
    recordRequestMetric({ method: request.method, route, status: 200, durationMs: Date.now() - start });
    return attachRequestHeaders(response, requestId);
  } catch (error) {
    logStructuredError(error, { ...getRequestContext(request, requestId), route });
    const response = NextResponse.json({ success: false, error: "Square checkout could not be activated. Verified payment and tax prerequisites must succeed before payment is accepted.", requestId }, { status: 503 });
    recordRequestMetric({ method: request.method, route, status: 503, durationMs: Date.now() - start });
    return attachRequestHeaders(response, requestId);
  }
}
