import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

const ORIGINAL_FETCH = globalThis.fetch;
const ORIGINAL_ENV = { ...process.env };

function restoreEnv() {
  for (const key of Object.keys(process.env)) {
    if (key.startsWith("SQUARE_") || key.startsWith("NEXT_PUBLIC_SQUARE_")) {
      delete process.env[key];
    }
  }

  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key];
      continue;
    }

    process.env[key] = value;
  }
}

function configureSquareEnv() {
  process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID = "app-id";
  process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID = "location-id";
  process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT = "production";
  process.env.SQUARE_ACCESS_TOKEN = "access-token";
  process.env.SQUARE_WEBHOOK_SIGNATURE_KEY = "webhook-secret";
  process.env.SQUARE_WEBHOOK_NOTIFICATION_URL =
    "https://edunancial.com/api/square/webhook";
  process.env.SQUARE_VERIFIED_CHECKOUT_ENABLED = "true";
}

beforeEach(() => {
  restoreEnv();
  configureSquareEnv();
});

afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  restoreEnv();
});

test("payment-link route preserves existing membership checkout behavior", async () => {
  let capturedPayload: Record<string, unknown> | null = null;

  globalThis.fetch = async (_input, init) => {
    capturedPayload = JSON.parse(String(init?.body ?? "{}")) as Record<
      string,
      unknown
    >;

    return new Response(
      JSON.stringify({
        payment_link: {
          url: "https://checkout.squareup.com/c/pay/membership-link",
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const { POST } = await import("../../app/api/square/payment-link/route.js");
  const response = await POST(
    new Request("https://edunancial.com/api/square/payment-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: "membership-basic-monthly" }),
    })
  );

  assert.equal(response.status, 200);
  assert.ok(capturedPayload);
  const payload = capturedPayload as Record<string, unknown>;

  const order = payload.order as {
    metadata: Record<string, string>;
  };

  assert.equal(order.metadata.catalog_item_id, "membership-basic-monthly");
  assert.equal(order.metadata.membership_plan_id, "basic");
});

test("course checkout route remains on the existing success flow", async () => {
  let capturedPayload: Record<string, unknown> | null = null;

  globalThis.fetch = async (_input, init) => {
    capturedPayload = JSON.parse(String(init?.body ?? "{}")) as Record<
      string,
      unknown
    >;

    return new Response(
      JSON.stringify({
        payment_link: {
          url: "https://checkout.squareup.com/c/pay/course-link",
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const { POST } = await import(
    "../../app/api/square/course-checkout/route.js"
  );
  const response = await POST(
    new Request("https://edunancial.com/api/square/course-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: "course-financial-foundations",
        courseName: "Financial Foundations Course",
        price: 49,
        currency: "usd",
      }),
    })
  );

  assert.equal(response.status, 200);
  assert.ok(capturedPayload);
  const payload = capturedPayload as Record<string, unknown>;

  const quickPay = payload.quick_pay as {
    price_money: { amount: number; currency: string };
  };
  const checkoutOptions = payload.checkout_options as {
    redirect_url: string;
  };

  assert.equal(quickPay.price_money.amount, 4900);
  assert.equal(quickPay.price_money.currency, "USD");
  assert.equal(
    checkoutOptions.redirect_url,
    "https://edunancial.com/payment/success?course=course-financial-foundations"
  );
});

test("webhook route still rejects invalid signatures when verified checkout is enabled", async () => {
  const { POST } = await import("../../app/api/square/webhook/route.js");
  const response = await POST(
    new Request("https://edunancial.com/api/square/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-square-hmacsha256-signature": "invalid-signature",
      },
      body: JSON.stringify({
        type: "payment.completed",
        event_id: "evt_invalid_signature",
      }),
    })
  );

  assert.equal(response.status, 401);
  const body = (await response.json()) as {
    success: boolean;
    error: string;
    requestId: string;
  };
  assert.equal(body.success, false);
  assert.equal(body.error, "Invalid signature");
  assert.ok(body.requestId.length > 0);
});

// TEMPORARY TEST ITEM — Square payment verification only, remove before next production content push
test("payment-link route accepts square-payment-test-001 and sends 100 cents USD to Square", async () => {
  let capturedUrl: string | null = null;
  let capturedPayload: Record<string, unknown> | null = null;

  globalThis.fetch = async (input, init) => {
    capturedUrl = String(input);
    capturedPayload = JSON.parse(String(init?.body ?? "{}")) as Record<
      string,
      unknown
    >;

    return new Response(
      JSON.stringify({
        payment_link: {
          url: "https://checkout.squareup.com/c/pay/test-link",
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  const { POST } = await import("../../app/api/square/payment-link/route.js");
  const response = await POST(
    new Request("https://edunancial.com/api/square/payment-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: "square-payment-test-001" }),
    })
  );

  assert.equal(response.status, 200);
  assert.ok(capturedUrl);
  assert.equal(
    capturedUrl,
    "https://connect.squareup.com/v2/online-checkout/payment-links"
  );
  assert.ok(capturedPayload);

  const payload = capturedPayload as Record<string, unknown>;
  const order = payload.order as {
    line_items: Array<{ base_price_money: { amount: number; currency: string } }>;
    metadata: Record<string, string>;
  };
  const checkoutOptions = payload.checkout_options as { redirect_url: string };

  assert.equal(order.line_items[0].base_price_money.amount, 100);
  assert.equal(order.line_items[0].base_price_money.currency, "USD");
  assert.equal(order.metadata.catalog_item_id, "square-payment-test-001");
  assert.equal(order.metadata.item_type, "other");
  assert.equal(order.metadata.productId, "square-payment-test-001");
  assert.equal(order.metadata.purpose, "square-payment-test");
  assert.equal(order.metadata.membership_plan_id, undefined);
  assert.ok(
    checkoutOptions.redirect_url.includes(
      "/payment/success?item=square-payment-test-001&type=other"
    )
  );
});
