import assert from "node:assert/strict";
import test from "node:test";

import {
  claimWebhookEvent,
  hasProcessedWebhookEvent,
  listProcessedWebhookEvents,
  resetWebhookIdempotencyForTests,
} from "../../../src/lib/payments/webhookIdempotency.ts";

test("first claim returns true (process the event)", () => {
  resetWebhookIdempotencyForTests();
  assert.equal(claimWebhookEvent("evt_001", "payment.completed"), true);
});

test("second claim for the same event ID returns false (duplicate)", () => {
  resetWebhookIdempotencyForTests();
  claimWebhookEvent("evt_002", "payment.completed");
  assert.equal(claimWebhookEvent("evt_002", "payment.completed"), false);
});

test("different event IDs are both claimable", () => {
  resetWebhookIdempotencyForTests();
  assert.equal(claimWebhookEvent("evt_a", "payment.completed"), true);
  assert.equal(claimWebhookEvent("evt_b", "subscription.created"), true);
});

test("hasProcessedWebhookEvent returns true after claim", () => {
  resetWebhookIdempotencyForTests();
  claimWebhookEvent("evt_check", "payment.completed");
  assert.equal(hasProcessedWebhookEvent("evt_check"), true);
});

test("hasProcessedWebhookEvent returns false for unclaimed events", () => {
  resetWebhookIdempotencyForTests();
  assert.equal(hasProcessedWebhookEvent("evt_never_seen"), false);
});

test("listProcessedWebhookEvents returns all claimed events", () => {
  resetWebhookIdempotencyForTests();
  claimWebhookEvent("evt_list_1", "payment.completed");
  claimWebhookEvent("evt_list_2", "subscription.deactivated");

  const events = listProcessedWebhookEvents();
  assert.equal(events.length, 2);
  const ids = events.map((e) => e.eventId);
  assert.ok(ids.includes("evt_list_1"));
  assert.ok(ids.includes("evt_list_2"));
});

test("reset clears all stored event IDs", () => {
  claimWebhookEvent("evt_before_reset", "payment.completed");
  resetWebhookIdempotencyForTests();
  assert.equal(hasProcessedWebhookEvent("evt_before_reset"), false);
  assert.equal(listProcessedWebhookEvents().length, 0);
});

test("claiming an event stores the event type", () => {
  resetWebhookIdempotencyForTests();
  claimWebhookEvent("evt_type_check", "subscription.deactivated");
  const events = listProcessedWebhookEvents();
  const found = events.find((e) => e.eventId === "evt_type_check");
  assert.ok(found);
  assert.equal(found.eventType, "subscription.deactivated");
});
