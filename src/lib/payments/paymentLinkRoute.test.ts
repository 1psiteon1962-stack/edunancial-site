import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

const ORIGINAL_FETCH = globalThis.fetch;
const ORIGINAL_ENV = { ...process.env };

function restoreEnv() {
  for (const key of Object.keys(process.env)) {
    if (key.startsWith("SQUARE_") || key.startsWith("NEXT_PUBLIC_SQUARE_") || key === "NEXT_PUBLIC_SUPABASE_URL" || key === "SUPABASE_SERVICE_ROLE_KEY") delete process.env[key];
  }
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
}

function configureSquareEnv() {
  process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID = "app-id";
  process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID = "location-id";
  process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT = "production";
  process.env.SQUARE_ACCESS_TOKEN = "access-token";
  process.env.SQUARE_WEBHOOK_SIGNATURE_KEY = "webhook-secret";
  process.env.SQUARE_WEBHOOK_NOTIFICATION_URL = "https://edunancial.com/api/square/webhook";
  process.env.SQUARE_VERIFIED_CHECKOUT_ENABLED = "true";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-project.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
}

function countryAwareFetch(squareHandler: typeof fetch, persistedBodies?: Record<string, unknown>[]): typeof fetch {
  return async (input, init) => {
    const url = String(input);
    if (url.startsWith("https://test-project.supabase.co/rest/v1/country_launch_controls")) return new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } });
    if (url.startsWith("https://test-project.supabase.co/rest/v1/payment_catalog_items")) return new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } });
    if (url.startsWith("https://test-project.supabase.co/rest/v1/orders")) {
      persistedBodies?.push(JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>);
      return new Response(JSON.stringify({ id: "order-db-1", square_order_id: "square-order-1" }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return squareHandler(input, init);
  };
}

beforeEach(() => { restoreEnv(); configureSquareEnv(); });
afterEach(() => { globalThis.fetch = ORIGINAL_FETCH; restoreEnv(); });

test("payment-link route preserves membership checkout and persists initiation", async () => {
  let capturedPayload: Record<string, unknown> | null = null;
  const persistedBodies: Record<string, unknown>[] = [];
  globalThis.fetch = countryAwareFetch(async (_input, init) => {
    capturedPayload = JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>;
    return new Response(JSON.stringify({ payment_link: { id: "square-link-1", order_id: "square-order-1", url: "https://checkout.squareup.com/c/pay/membership-link" } }), { status: 200, headers: { "Content-Type": "application/json" } });
  }, persistedBodies);

  const { POST } = await import("../../app/api/square/payment-link/route.js");
  const response = await POST(new Request("https://edunancial.com/api/square/payment-link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId: "membership-basic-monthly", customerEmail: "Member@Example.com" }) }));
  assert.equal(response.status, 200);
  assert.ok(capturedPayload);
  const order = (capturedPayload as Record<string, unknown>).order as { metadata: Record<string, string> };
  assert.equal(order.metadata.catalog_item_id, "membership-basic-monthly");
  assert.equal(order.metadata.membership_plan_id, "basic");
  assert.equal(order.metadata.country_code, "US");
  assert.equal(order.metadata.country_launch_state, "ACTIVE");
  assert.equal(persistedBodies.length, 1);
  assert.equal(persistedBodies[0].catalog_item_id, "membership-basic-monthly");
  assert.equal(persistedBodies[0].customer_email, "member@example.com");
  assert.equal(persistedBodies[0].square_payment_link_id, "square-link-1");
  assert.equal(persistedBodies[0].square_order_id, "square-order-1");
  assert.equal(persistedBodies[0].status, "pending");
});

test("webhook route still rejects invalid signatures when verified checkout is enabled", async () => {
  const { POST } = await import("../../app/api/square/webhook/route.js");
  const response = await POST(new Request("https://edunancial.com/api/square/webhook", { method: "POST", headers: { "Content-Type": "application/json", "x-square-hmacsha256-signature": "invalid-signature" }, body: JSON.stringify({ type: "payment.completed", event_id: "evt_invalid_signature" }) }));
  assert.equal(response.status, 401); const body = (await response.json()) as { success: boolean; error: string; requestId: string }; assert.equal(body.success, false); assert.equal(body.error, "Invalid signature"); assert.ok(body.requestId.length > 0);
});

// TEMPORARY TEST ITEM — Square payment verification only, remove before next production content push
test("payment-link route accepts square-payment-test-001, sends 100 cents, and persists the Square order", async () => {
  let capturedUrl: string | null = null, capturedPayload: Record<string, unknown> | null = null;
  const persistedBodies: Record<string, unknown>[] = [];
  globalThis.fetch = countryAwareFetch(async (input, init) => { capturedUrl = String(input); capturedPayload = JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>; return new Response(JSON.stringify({ payment_link: { id: "square-link-1", order_id: "square-order-1", url: "https://checkout.squareup.com/c/pay/test-link" } }), { status: 200, headers: { "Content-Type": "application/json" } }); }, persistedBodies);
  const { POST } = await import("../../app/api/square/payment-link/route.js");
  const response = await POST(new Request("https://edunancial.com/api/square/payment-link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId: "square-payment-test-001" }) }));
  assert.equal(response.status, 200); assert.equal(capturedUrl, "https://connect.squareup.com/v2/online-checkout/payment-links"); assert.ok(capturedPayload);
  const order = (capturedPayload as Record<string, unknown>).order as { line_items: Array<{ base_price_money: { amount: number; currency: string } }>; metadata: Record<string, string> }, checkoutOptions = (capturedPayload as Record<string, unknown>).checkout_options as { redirect_url: string };
  assert.equal(order.line_items[0].base_price_money.amount, 100); assert.equal(order.line_items[0].base_price_money.currency, "USD"); assert.equal(order.metadata.catalog_item_id, "square-payment-test-001"); assert.equal(order.metadata.item_type, "other"); assert.equal(order.metadata.productId, "square-payment-test-001"); assert.equal(order.metadata.purpose, "square-payment-test"); assert.equal(order.metadata.country_code, "US"); assert.equal(order.metadata.country_launch_state, "ACTIVE"); assert.equal(order.metadata.membership_plan_id, undefined); assert.ok(checkoutOptions.redirect_url.includes("/payment/success?item=square-payment-test-001&type=other"));
  assert.equal(persistedBodies.length, 1); assert.equal(persistedBodies[0].catalog_item_id, "square-payment-test-001"); assert.equal(persistedBodies[0].amount_requested, 1); assert.equal(persistedBodies[0].square_order_id, "square-order-1");
});