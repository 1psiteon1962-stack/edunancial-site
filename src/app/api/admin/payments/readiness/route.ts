import { NextResponse } from "next/server";

import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { hasPaymentPersistenceConfig } from "@/lib/payments/persistence";
import {
  ensureSquareWebhookSubscription,
  getSquareWebhookNotificationUrl,
  hasSquareWebhookVerificationConfig,
  validateSquareConfig,
} from "@/lib/square";

function flag(name: string) {
  return process.env[name] === "true";
}

export async function GET(request: Request) {
  const auth = await requireOwnerApiSession(request);
  if (!auth.ok) return auth.response;

  const squareConfigured = validateSquareConfig();
  const persistenceConfigured = hasPaymentPersistenceConfig();
  const webhookVerificationConfigured = hasSquareWebhookVerificationConfig();
  const taxEnforcementEnabled = flag("EDUNANCIAL_RUNTIME_TAX_ENFORCEMENT_ENABLED");
  const taxChargeAdapterEnabled = flag("EDUNANCIAL_SQUARE_TAX_LINE_ITEM_ENABLED");

  let webhookSubscriptionReady = false;
  let webhookSubscriptionId: string | null = null;
  let webhookError: string | null = null;

  if (squareConfigured) {
    try {
      const managed = await ensureSquareWebhookSubscription();
      webhookSubscriptionReady = true;
      webhookSubscriptionId = managed.subscriptionId;
    } catch (error) {
      webhookError = error instanceof Error ? error.message : "Square webhook readiness check failed.";
    }
  }

  const taxReady = !taxEnforcementEnabled || taxChargeAdapterEnabled;
  const ready =
    squareConfigured &&
    persistenceConfigured &&
    webhookVerificationConfigured &&
    webhookSubscriptionReady &&
    taxReady;

  return NextResponse.json({
    ready,
    environment: process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || "production",
    checks: {
      squareCredentials: squareConfigured,
      paymentPersistence: persistenceConfigured,
      webhookVerification: webhookVerificationConfigured,
      webhookSubscription: webhookSubscriptionReady,
      taxEnforcement: taxEnforcementEnabled,
      squareTaxChargeAdapter: taxChargeAdapterEnabled,
      taxReady,
    },
    webhook: {
      notificationUrl: getSquareWebhookNotificationUrl(),
      subscriptionId: webhookSubscriptionId,
      error: webhookError,
    },
  });
}
