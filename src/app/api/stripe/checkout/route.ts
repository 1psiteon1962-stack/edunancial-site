/** Stripe Checkout API for markets Square cannot settle in local currency (Canada / CAD first). OFF by default. */
import { NextResponse } from "next/server";

import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";
import { enforcePaymentRateLimit } from "@/lib/payments/rateLimiter";
import { resolveCatalogItem } from "@/lib/payments/catalog";
import { hasPaymentPersistenceConfig, persistCheckoutInitiation } from "@/lib/payments/persistence";
import {
  STRIPE_CHECKOUT_COUNTRIES,
  createStripeCheckoutSession,
  getStripeReadiness,
  isStripeCheckoutEnabled,
  toStripeMinorUnits,
} from "@/lib/payments/stripe";
import { getCountryByISO, isCountryFeatureEnabled } from "@/lib/countries/country-service";
import { getLocalizedCatalogPrice } from "@/lib/location/pricing";
import { resolveRequestCountry } from "@/lib/location/request-country";
import { assertCountryOperationAllowed } from "@/lib/regions/runtime-controls";

interface StripeCheckoutRequestBody {
  itemId?: string;
  discountCode?: string;
  customerEmail?: string;
  countryCode?: string;
  billingCountryConfirmed?: boolean;
}

function json(body: Record<string, unknown>, status: number, requestId: string) {
  return attachRequestHeaders(NextResponse.json(body, { status }), requestId);
}

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);
  const route = "/api/stripe/checkout";
  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const rateLimit = enforcePaymentRateLimit({ scope: "stripe-checkout", key: ipAddress, maxRequests: 20, windowMs: 60000 });
    if (!rateLimit.allowed) {
      const response = json({ success: false, error: "Too many checkout requests. Please wait and retry.", requestId }, 429, requestId);
      response.headers.set("Retry-After", Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString());
      return response;
    }

    if (!isStripeCheckoutEnabled() || !hasPaymentPersistenceConfig()) {
      return json({
        success: false,
        error: "Checkout in this currency is not yet open.",
        readiness: { ...getStripeReadiness(), persistenceConfigured: hasPaymentPersistenceConfig() },
        requestId,
      }, 503, requestId);
    }

    const body = (await request.json()) as StripeCheckoutRequestBody;
    const itemId = body.itemId?.trim() ?? "";
    if (!itemId) return json({ success: false, error: "itemId is required.", requestId }, 400, requestId);
    if (body.discountCode?.trim()) {
      return json({ success: false, error: "Discount codes are not yet available for this currency.", requestId }, 400, requestId);
    }

    const item = resolveCatalogItem(itemId);
    if (!item || !item.active || !item.membershipPlanId) {
      return json({ success: false, error: "The requested item is not available for purchase in this currency.", requestId }, 400, requestId);
    }

    const countryResolution = resolveRequestCountry(request.headers, body.countryCode, { billingCountryConfirmed: body.billingCountryConfirmed === true });
    if (!countryResolution) {
      return json({ success: false, error: "Your country could not be verified. Select your country before checkout.", requestId }, 422, requestId);
    }
    if (countryResolution.mismatch) {
      return json({
        success: false,
        error: `Your selected country (${countryResolution.requestedCountryCode}) does not match the detected checkout country (${countryResolution.detectedCountryCode}). Confirm your billing country before payment.`,
        billingCountryConfirmationRequired: true,
        selectedCountry: countryResolution.requestedCountryCode,
        detectedCountry: countryResolution.detectedCountryCode,
        requestId,
      }, 409, requestId);
    }

    const countryCode = countryResolution.countryCode;
    const stripeCurrency = STRIPE_CHECKOUT_COUNTRIES[countryCode];
    if (!stripeCurrency) {
      return json({ success: false, error: `Country ${countryCode} does not use this checkout.`, countryCode, requestId }, 409, requestId);
    }
    const country = getCountryByISO(countryCode);
    if (!country || !isCountryFeatureEnabled(countryCode, "paymentsEnabled")) {
      return json({ success: false, error: `Paid checkout is not enabled for country ${countryCode}.`, countryCode, requestId }, 403, requestId);
    }

    // Approved local price only — never invented here.
    const localized = getLocalizedCatalogPrice(item.id, countryCode);
    if (!localized || localized.currency.toUpperCase() !== stripeCurrency || country.currency.trim().toUpperCase() !== stripeCurrency) {
      return json({ success: false, error: `No approved ${stripeCurrency} price is configured for this item.`, countryCode, requestId }, 409, requestId);
    }

    let countryControl: { countryCode: string; launchState: string };
    try {
      countryControl = await assertCountryOperationAllowed(countryCode, ["ACTIVE", "BETA"]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Checkout is not enabled for this country.";
      return json({ success: false, error: message, countryCode, requestId }, 403, requestId);
    }

    if (process.env.EDUNANCIAL_RUNTIME_TAX_ENFORCEMENT_ENABLED === "true") {
      // Stripe tax collection is not wired yet; block rather than under-collect.
      return json({ success: false, error: "Tax collection for this currency is not configured yet. Checkout is blocked to prevent under-collection.", taxStatus: "stripe-tax-not-configured", requestId }, 503, requestId);
    }

    const appOrigin = new URL(request.url).origin;
    const successParams = new URLSearchParams({ item: item.id, type: item.type, country: countryControl.countryCode, plan: item.membershipPlanId, provider: "stripe" });
    const metadata: Record<string, string> = {
      catalog_item_id: item.id,
      item_type: item.type,
      membership_plan_id: item.membershipPlanId,
      country_code: countryControl.countryCode,
      country_source: countryResolution.source,
      country_launch_state: countryControl.launchState,
      currency: localized.currency,
      amount_minor: String(toStripeMinorUnits(localized.amount, localized.currency)),
      price_rate_version: localized.rateVersion,
      ...(countryResolution.networkCountryMismatch && countryResolution.detectedCountryCode
        ? { network_country_code: countryResolution.detectedCountryCode, billing_country_confirmed: "true" }
        : {}),
    };
    const idempotencyKey = `${requestId}-${item.id}-stripe`;
    const session = await createStripeCheckoutSession({
      itemId: item.id,
      itemName: item.name,
      amount: localized.amount,
      currency: localized.currency,
      successUrl: `${appOrigin}/payment/success?${successParams.toString()}`,
      cancelUrl: `${appOrigin}/checkout?plan=${encodeURIComponent(item.membershipPlanId)}&item=${encodeURIComponent(item.id)}`,
      customerEmail: body.customerEmail,
      idempotencyKey,
      metadata,
    });

    await persistCheckoutInitiation({
      // Keep the master (USD) catalog row intact; the order row records the CAD charge.
      item,
      customerEmail: body.customerEmail,
      amountRequested: localized.amount,
      currency: localized.currency,
      discountAmount: 0,
      idempotencyKey,
      metadata: {
        requestId,
        provider: "stripe",
        stripeCheckoutSessionId: session.id,
        countryCode: countryControl.countryCode,
        countrySource: countryResolution.source,
        networkCountryCode: countryResolution.detectedCountryCode,
        billingCountryConfirmed: countryResolution.source === "billing-confirmed",
        countryLaunchState: countryControl.launchState,
        priceRateVersion: localized.rateVersion,
      },
    });

    recordRequestMetric({ method: request.method, route, status: 200, durationMs: Date.now() - start });
    return json({
      success: true,
      provider: "stripe",
      checkoutUrl: session.url,
      countryCode: countryControl.countryCode,
      amount: localized.amount,
      currency: localized.currency,
      itemId: item.id,
      planId: item.membershipPlanId,
      requestId,
    }, 200, requestId);
  } catch (error) {
    logStructuredError(error, { ...getRequestContext(request, requestId), route });
    const message = error instanceof Error ? error.message : "Unknown Stripe checkout error";
    recordRequestMetric({ method: request.method, route, status: 503, durationMs: Date.now() - start });
    return json({ success: false, error: "Checkout could not be started.", diagnostic: process.env.NODE_ENV === "production" ? undefined : message, requestId }, 503, requestId);
  }
}
