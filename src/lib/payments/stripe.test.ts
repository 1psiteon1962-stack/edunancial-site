import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { afterEach, test } from "node:test";

import { checkoutEndpointForCountry, isStripeCheckoutCountry } from "./stripe-countries";
import { isStripeCheckoutEnabled, toStripeMinorUnits, verifyStripeWebhookSignature } from "./stripe";
import { fulfillStripeCheckoutSession } from "./stripeFulfillment";

const SAVED = { ...process.env };
afterEach(() => {
  for (const key of ["EDUNANCIAL_STRIPE_CHECKOUT_ENABLED", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]) {
    if (SAVED[key] === undefined) delete process.env[key]; else process.env[key] = SAVED[key];
  }
});

function sign(body: string, secret: string, t: number) {
  return `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")}`;
}

test("Stripe checkout stays OFF unless flag, secret key and webhook secret are all set", () => {
  delete process.env.EDUNANCIAL_STRIPE_CHECKOUT_ENABLED;
  process.env.STRIPE_SECRET_KEY = "sk_test_x";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
  assert.equal(isStripeCheckoutEnabled(), false);
  process.env.EDUNANCIAL_STRIPE_CHECKOUT_ENABLED = "true";
  delete process.env.STRIPE_WEBHOOK_SECRET;
  assert.equal(isStripeCheckoutEnabled(), false);
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
  assert.equal(isStripeCheckoutEnabled(), true);
});

test("Canada routes to Stripe; the US stays on Square", () => {
  assert.equal(isStripeCheckoutCountry("ca"), true);
  assert.equal(isStripeCheckoutCountry("US"), false);
  assert.equal(checkoutEndpointForCountry("CA"), "/api/stripe/checkout");
  assert.equal(checkoutEndpointForCountry("US"), "/api/square/payment-link");
});

test("CAD amounts convert to exact minor units", () => {
  assert.equal(toStripeMinorUnits(20.99, "CAD"), 2099);
  assert.equal(toStripeMinorUnits(416.99, "cad"), 41699);
  assert.throws(() => toStripeMinorUnits(100, "JPY"));
  assert.throws(() => toStripeMinorUnits(0, "CAD"));
});

test("webhook signature: valid accepted; tampered, stale, or unsigned rejected", () => {
  const secret = "whsec_test";
  const body = JSON.stringify({ id: "evt_1" });
  const now = 1_800_000_000;
  assert.equal(verifyStripeWebhookSignature(body, sign(body, secret, now), secret, 300, now), true);
  assert.equal(verifyStripeWebhookSignature(body + " ", sign(body, secret, now), secret, 300, now), false);
  assert.equal(verifyStripeWebhookSignature(body, sign(body, secret, now - 3600), secret, 300, now), false);
  assert.equal(verifyStripeWebhookSignature(body, sign(body, "other", now), secret, 300, now), false);
  assert.equal(verifyStripeWebhookSignature(body, null, secret, 300, now), false);
  assert.equal(verifyStripeWebhookSignature(body, sign(body, secret, now), "", 300, now), false);
});

const paidSession = {
  payment_status: "paid",
  amount_total: 2099,
  currency: "cad",
  customer_details: { email: "member@example.com" },
  metadata: { membership_plan_id: "basic", catalog_item_id: "membership-basic-monthly", country_code: "CA" },
};

test("fulfillment grants membership only when the exact approved CAD price was paid", async () => {
  assert.deepEqual(await fulfillStripeCheckoutSession(paidSession), { fulfilled: true, email: "member@example.com", planId: "basic" });
  assert.deepEqual(await fulfillStripeCheckoutSession({ ...paidSession, amount_total: 1499 }), { fulfilled: false, reason: "amount-mismatch" });
  assert.deepEqual(await fulfillStripeCheckoutSession({ ...paidSession, currency: "usd" }), { fulfilled: false, reason: "amount-mismatch" });
  assert.deepEqual(await fulfillStripeCheckoutSession({ ...paidSession, payment_status: "unpaid" }), { fulfilled: false, reason: "not-paid" });
  assert.deepEqual(
    await fulfillStripeCheckoutSession({ ...paidSession, metadata: { ...paidSession.metadata, membership_plan_id: "enterprise" } }),
    { fulfilled: false, reason: "unknown-item" },
  );
});
