import assert from "node:assert/strict";
import test from "node:test";

import {
  listPaymentEmailEvents,
  queuePaymentEmailEvent,
  resetPaymentEmailEventsForTests,
} from "../../../src/lib/payments/emailAutomation.ts";
import { enforcePaymentRateLimit } from "../../../src/lib/payments/rateLimiter.ts";

test("payment email automation queues required templates", () => {
  resetPaymentEmailEventsForTests();

  queuePaymentEmailEvent({
    templateId: "payment-confirmation",
    recipientEmail: "member@example.com",
    membershipPlanId: "basic",
  });
  queuePaymentEmailEvent({
    templateId: "welcome",
    recipientEmail: "member@example.com",
    membershipPlanId: "basic",
  });

  const events = listPaymentEmailEvents();
  assert.equal(events.length, 2);
  assert.equal(events[0]?.templateId, "payment-confirmation");
  assert.equal(events[1]?.templateId, "welcome");
});

test("rate limiting blocks requests after threshold", () => {
  const scope = `test-${Date.now()}`;
  const key = "127.0.0.1";

  const first = enforcePaymentRateLimit({
    scope,
    key,
    maxRequests: 2,
    windowMs: 60_000,
  });
  const second = enforcePaymentRateLimit({
    scope,
    key,
    maxRequests: 2,
    windowMs: 60_000,
  });
  const third = enforcePaymentRateLimit({
    scope,
    key,
    maxRequests: 2,
    windowMs: 60_000,
  });

  assert.equal(first.allowed, true);
  assert.equal(second.allowed, true);
  assert.equal(third.allowed, false);
});
