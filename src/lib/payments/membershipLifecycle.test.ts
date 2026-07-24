import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";

import {
  processSquareLifecycleEvent,
  provisionMemberFromPayment,
  listMembershipSubscriptions,
  listProvisionedMembers,
  resetMembershipLifecycleForTests,
} from "@/lib/payments/membershipLifecycle";
import { resetPaymentEmailEventsForTests, listPaymentEmailEvents } from "@/lib/payments/emailAutomation";

afterEach(() => {
  resetMembershipLifecycleForTests();
  resetPaymentEmailEventsForTests();
});

describe("provisionMemberFromPayment", () => {
  test("creates a new member and subscription on first payment", () => {
    const result = provisionMemberFromPayment({
      email: "alice@example.com",
      planId: "basic",
      providerSubscriptionId: "sq-sub-001",
      providerPaymentId: "sq-pay-001",
    });

    assert.equal(result.member.email, "alice@example.com");
    assert.equal(result.member.membershipTier, "basic");
    assert.equal(result.member.active, true);
    assert.equal(result.member.hasDashboardAccess, true);
    assert.ok(result.member.nextJourneyRoute.length > 0);

    assert.equal(result.subscription.memberEmail, "alice@example.com");
    assert.equal(result.subscription.planId, "basic");
    assert.equal(result.subscription.status, "active");
    assert.equal(result.subscription.provider, "square");
    assert.equal(result.subscription.providerSubscriptionId, "sq-sub-001");
  });

  test("upserts existing member and adds new subscription", () => {
    provisionMemberFromPayment({ email: "bob@example.com", planId: "basic" });
    const result = provisionMemberFromPayment({ email: "bob@example.com", planId: "premium" });

    assert.equal(result.member.membershipTier, "premium");
    assert.equal(listProvisionedMembers().length, 1);
    assert.equal(listMembershipSubscriptions().length, 2);
  });

  test("queues payment-confirmation, membership-confirmation, welcome, and receipt emails", () => {
    provisionMemberFromPayment({ email: "carol@example.com", planId: "basic" });
    const events = listPaymentEmailEvents();
    const templates = events.map((e) => e.templateId);
    assert.ok(templates.includes("payment-confirmation"));
    assert.ok(templates.includes("membership-confirmation"));
    assert.ok(templates.includes("welcome"));
    assert.ok(templates.includes("receipt"));
  });
});

describe("processSquareLifecycleEvent — payment.completed", () => {
  test("provisions member and returns processed=true when email present", () => {
    const result = processSquareLifecycleEvent({
      type: "payment.completed",
      data: {
        object: {
          customer_email: "dave@example.com",
          plan_id: "premium",
          payment_id: "sq-pay-002",
        },
      },
    });

    assert.equal(result.processed, true);
    assert.equal(result.eventType, "payment.completed");
    assert.equal(result.status, "active");
    assert.ok(result.subscriptionId);
    assert.ok(result.nextJourneyRoute);
    assert.equal(listProvisionedMembers().length, 1);
  });

  test("returns processed=false when email is missing", () => {
    const result = processSquareLifecycleEvent({
      type: "payment.completed",
      data: { object: {} },
    });

    assert.equal(result.processed, false);
    assert.equal(listProvisionedMembers().length, 0);
  });
});

describe("processSquareLifecycleEvent — subscription lifecycle", () => {
  test("subscription.updated sets status to active and sends renewal email", () => {
    const provisioned = provisionMemberFromPayment({
      email: "eve@example.com",
      planId: "basic",
      providerSubscriptionId: "sq-sub-100",
    });

    resetPaymentEmailEventsForTests();

    const result = processSquareLifecycleEvent({
      type: "subscription.updated",
      data: { object: { id: "sq-sub-100", plan_id: "basic" } },
    });

    assert.equal(result.processed, true);
    assert.equal(result.status, "active");
    assert.equal(result.subscriptionId, provisioned.subscription.id);

    const emails = listPaymentEmailEvents();
    assert.ok(emails.some((e) => e.templateId === "renewal-confirmation"));
  });

  test("subscription.deactivated sets status to cancelled and sends cancellation email", () => {
    provisionMemberFromPayment({
      email: "frank@example.com",
      planId: "basic",
      providerSubscriptionId: "sq-sub-200",
    });

    resetPaymentEmailEventsForTests();

    const result = processSquareLifecycleEvent({
      type: "subscription.deactivated",
      data: { object: { id: "sq-sub-200" } },
    });

    assert.equal(result.processed, true);
    assert.equal(result.status, "cancelled");

    const emails = listPaymentEmailEvents();
    assert.ok(emails.some((e) => e.templateId === "cancellation-confirmation"));
  });

  test("returns processed=false for unknown subscription reference", () => {
    const result = processSquareLifecycleEvent({
      type: "subscription.deactivated",
      data: { object: { id: "does-not-exist" } },
    });
    assert.equal(result.processed, false);
  });
});

describe("processSquareLifecycleEvent — payment.updated", () => {
  test("FAILED payment sets status to past-due and sends failed-payment email", () => {
    provisionMemberFromPayment({
      email: "grace@example.com",
      planId: "premium",
      providerSubscriptionId: "sq-sub-300",
    });

    resetPaymentEmailEventsForTests();

    const result = processSquareLifecycleEvent({
      type: "payment.updated",
      data: { object: { id: "sq-sub-300", status: "FAILED" } },
    });

    assert.equal(result.processed, true);
    assert.equal(result.status, "past-due");

    const emails = listPaymentEmailEvents();
    assert.ok(emails.some((e) => e.templateId === "failed-payment"));
  });

  test("COMPLETED payment sets status to reactivated and sends renewal email", () => {
    provisionMemberFromPayment({
      email: "henry@example.com",
      planId: "basic",
      providerSubscriptionId: "sq-sub-400",
    });

    resetPaymentEmailEventsForTests();

    const result = processSquareLifecycleEvent({
      type: "payment.updated",
      data: { object: { id: "sq-sub-400", status: "COMPLETED" } },
    });

    assert.equal(result.processed, true);
    assert.equal(result.status, "reactivated");

    const emails = listPaymentEmailEvents();
    assert.ok(emails.some((e) => e.templateId === "renewal-confirmation"));
  });

  test("unknown payment status returns processed=false", () => {
    provisionMemberFromPayment({
      email: "iris@example.com",
      planId: "basic",
      providerSubscriptionId: "sq-sub-500",
    });

    const result = processSquareLifecycleEvent({
      type: "payment.updated",
      data: { object: { id: "sq-sub-500", status: "PENDING" } },
    });

    assert.equal(result.processed, false);
  });
});

describe("processSquareLifecycleEvent — unknown event type", () => {
  test("returns processed=false for unrecognised event types", () => {
    const result = processSquareLifecycleEvent({ type: "catalog.updated" });
    assert.equal(result.processed, false);
    assert.equal(result.eventType, "catalog.updated");
  });
});
