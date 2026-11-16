import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { __setPaymentPersistenceTestAdapterForTests } from "@/lib/payments/persistence";

const ORIGINAL_FETCH = globalThis.fetch;
const KEYS = ["EDUNANCIAL_STRIPE_CHECKOUT_ENABLED", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const SAVED: Record<string, string | undefined> = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));
let stripeCalls = 0;

beforeEach(() => {
  stripeCalls = 0;
  __setPaymentPersistenceTestAdapterForTests(async () => ({ id: "order-1" }));
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("api.stripe.com")) stripeCalls += 1;
    if (url.includes("/rest/v1/")) return new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ id: "cs_test_1", url: "https://checkout.stripe.com/c/pay/cs_test_1", amount_total: 2099, currency: "cad" }), { status: 200 });
  }) as typeof fetch;
});
afterEach(() => {
  __setPaymentPersistenceTestAdapterForTests(null);
  globalThis.fetch = ORIGINAL_FETCH;
  for (const key of KEYS) { if (SAVED[key] === undefined) delete process.env[key]; else process.env[key] = SAVED[key]; }
});

function enable() {
  process.env.EDUNANCIAL_STRIPE_CHECKOUT_ENABLED = "true";
  process.env.STRIPE_SECRET_KEY = "sk_test_x";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-project.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
}

async function post(body: Record<string, unknown>, country = "CA") {
  const { POST } = await import("../../app/api/stripe/checkout/route.js");
  return POST(new Request("https://edunancial.com/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json", "x-nf-country": country }, body: JSON.stringify(body) }));
}

test("Stripe checkout is closed by default and never calls Stripe", async () => {
  delete process.env.EDUNANCIAL_STRIPE_CHECKOUT_ENABLED;
  const response = await post({ itemId: "membership-basic-monthly", countryCode: "CA" });
  assert.equal(response.status, 503);
  assert.equal(stripeCalls, 0);
});

test("Even when switched on, Canada stays blocked until its country payment control is enabled", async () => {
  enable();
  const response = await post({ itemId: "membership-basic-monthly", countryCode: "CA" });
  assert.equal(response.status, 403);
  assert.equal(stripeCalls, 0);
});

test("US buyers are not routed through Stripe", async () => {
  enable();
  const response = await post({ itemId: "membership-basic-monthly", countryCode: "US" }, "US");
  assert.equal(response.status, 409);
  assert.equal(stripeCalls, 0);
});

test("Discount codes are refused for Stripe checkout rather than mis-priced", async () => {
  enable();
  const response = await post({ itemId: "membership-basic-monthly", countryCode: "CA", discountCode: "SAVE10" });
  assert.equal(response.status, 400);
  assert.equal(stripeCalls, 0);
});
