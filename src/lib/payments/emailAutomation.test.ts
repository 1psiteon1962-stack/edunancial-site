import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";

import {
  queuePaymentEmailEvent,
  listPaymentEmailEvents,
  resetPaymentEmailEventsForTests,
} from "@/lib/payments/emailAutomation";

afterEach(() => {
  resetPaymentEmailEventsForTests();
});

describe("queuePaymentEmailEvent", () => {
  test("queues an event and returns it with id and createdAt", () => {
    const event = queuePaymentEmailEvent({
      templateId: "payment-confirmation",
      recipientEmail: "alice@example.com",
      membershipPlanId: "basic",
      subscriptionId: "sub_abc",
    });

    assert.ok(event.id.startsWith("email_"));
    assert.equal(event.templateId, "payment-confirmation");
    assert.equal(event.recipientEmail, "alice@example.com");
    assert.equal(event.membershipPlanId, "basic");
    assert.equal(event.subscriptionId, "sub_abc");
    assert.ok(event.createdAt);
  });

  test("listPaymentEmailEvents returns all queued events", () => {
    queuePaymentEmailEvent({ templateId: "welcome", recipientEmail: "a@example.com" });
    queuePaymentEmailEvent({ templateId: "receipt", recipientEmail: "b@example.com" });

    const events = listPaymentEmailEvents();
    assert.equal(events.length, 2);
    assert.equal(events[0].templateId, "welcome");
    assert.equal(events[1].templateId, "receipt");
  });

  test("resetPaymentEmailEventsForTests clears the queue", () => {
    queuePaymentEmailEvent({ templateId: "welcome", recipientEmail: "a@example.com" });
    resetPaymentEmailEventsForTests();
    assert.equal(listPaymentEmailEvents().length, 0);
  });

  test("listPaymentEmailEvents returns a copy, not the internal array", () => {
    queuePaymentEmailEvent({ templateId: "welcome", recipientEmail: "a@example.com" });
    const events = listPaymentEmailEvents();
    events.push({
      id: "fake",
      templateId: "welcome",
      recipientEmail: "fake@example.com",
      createdAt: new Date().toISOString(),
    });

    assert.equal(listPaymentEmailEvents().length, 1);
  });

  test("accepts optional metadata", () => {
    const event = queuePaymentEmailEvent({
      templateId: "payment-confirmation",
      recipientEmail: "c@example.com",
      metadata: { courseId: "course-101", amount: "19.99" },
    });

    assert.equal(event.metadata?.courseId, "course-101");
    assert.equal(event.metadata?.amount, "19.99");
  });
});
