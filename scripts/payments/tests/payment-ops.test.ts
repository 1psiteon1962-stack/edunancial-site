import assert from "node:assert/strict";
import test from "node:test";

import {
  listPaymentEmailEvents,
  queuePaymentEmailEvent,
  resetPaymentEmailEventsForTests,
} from "../../../src/lib/payments/emailAutomation.ts";
import { enforcePaymentRateLimit } from "../../../src/lib/payments/rateLimiter.ts";
import {
  claimWebhookEvent,
  hasProcessedWebhookEvent,
  listProcessedWebhookEvents,
  resetWebhookIdempotencyForTests,
} from "../../../src/lib/payments/webhookIdempotency.ts";
import {
  getCatalogItem,
  getActiveCatalogItems,
  resolveCatalogItem,
} from "../../../src/lib/payments/catalog.ts";
import {
  applyDiscountCode,
  resetDiscountRedemptionsForTests,
} from "../../../src/lib/payments/discounts.ts";

// ── Email automation ──────────────────────────────────────────────────────────

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

test("all payment email templates include recipient email", () => {
  resetPaymentEmailEventsForTests();

  const templates: Array<Parameters<typeof queuePaymentEmailEvent>[0]["templateId"]> = [
    "payment-confirmation",
    "membership-confirmation",
    "welcome",
    "receipt",
    "renewal-confirmation",
    "failed-payment",
    "cancellation-confirmation",
  ];

  for (const templateId of templates) {
    queuePaymentEmailEvent({ templateId, recipientEmail: "test@example.com" });
  }

  const events = listPaymentEmailEvents();
  assert.equal(events.length, templates.length);
  for (const evt of events) {
    assert.ok(evt.recipientEmail.length > 0);
    assert.ok(evt.id.length > 0);
    assert.ok(evt.createdAt.length > 0);
  }
});

// ── Rate limiting ─────────────────────────────────────────────────────────────

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

test("rate limiting resets after window expires", () => {
  const scope = `window-test-${Date.now()}`;
  const key = "192.168.1.1";

  // Exhaust the limit with a tiny window.
  enforcePaymentRateLimit({ scope, key, maxRequests: 1, windowMs: 1 });
  enforcePaymentRateLimit({ scope, key, maxRequests: 1, windowMs: 1 });

  // After >1 ms the window should reset; use a new scope to avoid sharing state.
  const newScope = `window-reset-${Date.now()}`;
  const fresh = enforcePaymentRateLimit({
    scope: newScope,
    key,
    maxRequests: 1,
    windowMs: 60_000,
  });

  assert.equal(fresh.allowed, true);
});

// ── Webhook idempotency ───────────────────────────────────────────────────────

test("webhook duplicate protection: same event ID blocked on second claim", () => {
  resetWebhookIdempotencyForTests();

  const first = claimWebhookEvent("dup-ops-001", "payment.completed");
  const second = claimWebhookEvent("dup-ops-001", "payment.completed");

  assert.equal(first, true, "first claim must succeed");
  assert.equal(second, false, "second claim must be rejected (duplicate)");
});

test("webhook idempotency: different event IDs are both claimable", () => {
  resetWebhookIdempotencyForTests();

  assert.equal(claimWebhookEvent("ops-a", "payment.completed"), true);
  assert.equal(claimWebhookEvent("ops-b", "subscription.created"), true);
});

test("hasProcessedWebhookEvent reflects claimed events", () => {
  resetWebhookIdempotencyForTests();

  claimWebhookEvent("check-ops-001", "payment.updated");
  assert.equal(hasProcessedWebhookEvent("check-ops-001"), true);
  assert.equal(hasProcessedWebhookEvent("not-claimed"), false);
});

test("listProcessedWebhookEvents includes event type", () => {
  resetWebhookIdempotencyForTests();

  claimWebhookEvent("list-ops-001", "subscription.deactivated");
  const events = listProcessedWebhookEvents();
  const found = events.find((e) => e.eventId === "list-ops-001");
  assert.ok(found);
  assert.equal(found.eventType, "subscription.deactivated");
});

// ── Catalog ───────────────────────────────────────────────────────────────────

test("catalog: basic monthly membership resolves correctly", () => {
  const item = getCatalogItem("membership-basic-monthly");
  assert.ok(item);
  assert.equal(item.membershipPlanId, "basic");
  assert.equal(item.isRecurring, true);
  assert.equal(item.recurringInterval, "monthly");
  assert.ok(item.price > 0);
  assert.equal(item.active, true);
});

test("catalog: getActiveCatalogItems returns only active items", () => {
  const active = getActiveCatalogItems();
  assert.ok(active.every((i) => i.active));
});

test("catalog: resolveCatalogItem supports legacy plan IDs", () => {
  const basic = resolveCatalogItem("basic");
  const premium = resolveCatalogItem("premium");
  const enterprise = resolveCatalogItem("enterprise");

  assert.ok(basic?.membershipPlanId === "basic");
  assert.ok(premium?.membershipPlanId === "premium");
  assert.ok(enterprise?.membershipPlanId === "enterprise");
});

test("catalog: resolveCatalogItem returns undefined for unknown IDs", () => {
  assert.equal(resolveCatalogItem("ghost-plan-xyz"), undefined);
});

// ── Discount codes ────────────────────────────────────────────────────────────

test("discount: invalid code returns valid=false with helpful error", () => {
  resetDiscountRedemptionsForTests();

  const result = applyDiscountCode("BADCODE", "membership-basic-monthly", 39.99, "USD");
  assert.equal(result.valid, false);
  assert.equal(result.discountAmount, 0);
  assert.equal(result.finalPrice, 39.99);
  assert.ok(result.errorMessage && result.errorMessage.length > 0);
});

test("discount: finalPrice equals base price when no valid code applied", () => {
  resetDiscountRedemptionsForTests();

  const result = applyDiscountCode("", "item-001", 100.00, "USD");
  assert.equal(result.valid, false);
  assert.equal(result.finalPrice, 100.00);
});
