import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";

import {
  hasSquareWebhookVerificationConfig,
  isSquareVerifiedCheckoutEnabled,
  verifySquareWebhookSignature,
} from "../../../src/lib/square.ts";

const ORIGINAL_ENV = { ...process.env };

function restoreSquareEnv() {
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

test("Square checkout stays disabled without the verified checkout flag", () => {
  restoreSquareEnv();
  process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID = "app";
  process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID = "loc";
  process.env.SQUARE_ACCESS_TOKEN = "token";
  process.env.SQUARE_WEBHOOK_SIGNATURE_KEY = "secret";
  process.env.SQUARE_WEBHOOK_NOTIFICATION_URL =
    "https://www.edunancial.com/api/square/webhook";

  assert.equal(hasSquareWebhookVerificationConfig(), true);
  assert.equal(isSquareVerifiedCheckoutEnabled(), false);
});

test("Square webhook verification rejects missing or invalid signatures", () => {
  restoreSquareEnv();
  process.env.SQUARE_WEBHOOK_SIGNATURE_KEY = "secret";
  process.env.SQUARE_WEBHOOK_NOTIFICATION_URL =
    "https://www.edunancial.com/api/square/webhook";

  const body = JSON.stringify({ type: "payment.updated" });

  assert.equal(verifySquareWebhookSignature(body, null), false);
  assert.equal(verifySquareWebhookSignature(body, "invalid"), false);
});

test("Square webhook verification accepts the expected HMAC signature", () => {
  restoreSquareEnv();
  process.env.SQUARE_WEBHOOK_SIGNATURE_KEY = "secret";
  process.env.SQUARE_WEBHOOK_NOTIFICATION_URL =
    "https://www.edunancial.com/api/square/webhook";

  const body = JSON.stringify({ type: "payment.updated", id: "evt_123" });
  const signature = createHmac("sha256", "secret")
    .update(`https://www.edunancial.com/api/square/webhook${body}`)
    .digest("base64");

  assert.equal(verifySquareWebhookSignature(body, signature), true);
});
