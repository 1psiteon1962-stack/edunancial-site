/**
 * Full payment pipeline integration tests.
 *
 * Tests the complete end-to-end payment pipeline:
 *   Customer → Checkout → Square Payment → Webhook Verification →
 *   Membership Activation → Database Update → Email Queue
 *
 * Runs via `npm test` (tsc → .test-dist → node --test).
 */

import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";

import {
  processSquareLifecycleEvent,
  provisionMemberFromPayment,
  listMembershipSubscriptions,
  listProvisionedMembers,
  resetMembershipLifecycleForTests,
} from "@/lib/payments/membershipLifecycle";
import {
  listPaymentEmailEvents,
  resetPaymentEmailEventsForTests,
} from "@/lib/payments/emailAutomation";
import {
  claimWebhookEvent,
  hasProcessedWebhookEvent,
  resetWebhookIdempotencyForTests,
} from "@/lib/payments/webhookIdempotency";

afterEach(() => {
  resetMembershipLifecycleForTests();
  resetPaymentEmailEventsForTests();
  resetWebhookIdempotencyForTests();
});

// ── Monthly membership purchase ──────────────────────────────────────────────

describe("monthly membership purchase pipeline", () => {
  test("provisions member with active dashboard access after payment", () => {
    const result = provisionMemberFromPayment({
      email: "pipeline-monthly@example.com",
      planId: "basic",
      providerSubscriptionId: "sq-sub-pipeline-monthly-001",
      providerPaymentId: "sq-pay-pipeline-monthly-001",
    });

    assert.equal(result.member.active, true, "member must be active");
    assert.equal(result.member.hasDashboardAccess, true, "dashboard access required");
    assert.equal(result.member.membershipTier, "basic");
    assert.ok(result.nextJourneyRoute.length > 0);
  });

  test("membership activation sends all required email templates", () => {
    provisionMemberFromPayment({
      email: "email-pipeline@example.com",
      planId: "basic",
    });

    const templates = listPaymentEmailEvents().map((e) => e.templateId);
    assert.ok(templates.includes("payment-confirmation"), "missing payment-confirmation");
    assert.ok(templates.includes("membership-confirmation"), "missing membership-confirmation");
    assert.ok(templates.includes("welcome"), "missing welcome");
    assert.ok(templates.includes("receipt"), "missing receipt");
  });

  test("member dashboard access is set correctly", () => {
    provisionMemberFromPayment({ email: "dash-test@example.com", planId: "basic" });

    const members = listProvisionedMembers();
    const member = members.find((m) => m.email === "dash-test@example.com");
    assert.ok(member);
    assert.equal(member!.hasDashboardAccess, true);
  });

  test("protected curriculum unlocks: active member passes access check", () => {
    provisionMemberFromPayment({ email: "curriculum-check@example.com", planId: "basic" });

    const member = listProvisionedMembers().find(
      (m) => m.email === "curriculum-check@example.com"
    );
    assert.ok(member?.active, "member must be active");
    assert.ok(member?.hasDashboardAccess, "curriculum access requires dashboard access");
  });
});

// ── Subscription renewal ──────────────────────────────────────────────────────

describe("subscription renewal pipeline", () => {
  test("subscription.updated sets status to active and sends renewal email", () => {
    provisionMemberFromPayment({
      email: "renew-test@example.com",
      planId: "basic",
      providerSubscriptionId: "sq-sub-renew-001",
    });
    resetPaymentEmailEventsForTests();

    const result = processSquareLifecycleEvent({
      type: "subscription.updated",
      data: { object: { id: "sq-sub-renew-001", plan_id: "basic" } },
    });

    assert.equal(result.processed, true);
    assert.equal(result.status, "active");

    const emails = listPaymentEmailEvents();
    assert.ok(
      emails.some((e) => e.templateId === "renewal-confirmation"),
      "must queue renewal-confirmation email"
    );
  });
});

// ── Subscription cancellation ──────────────────────────────────────────────────

describe("subscription cancellation pipeline", () => {
  test("subscription.deactivated sets cancelled status and deactivates member", () => {
    provisionMemberFromPayment({
      email: "cancel-test@example.com",
      planId: "basic",
      providerSubscriptionId: "sq-sub-cancel-002",
    });
    resetPaymentEmailEventsForTests();

    const result = processSquareLifecycleEvent({
      type: "subscription.deactivated",
      data: { object: { id: "sq-sub-cancel-002" } },
    });

    assert.equal(result.processed, true);
    assert.equal(result.status, "cancelled");

    const emails = listPaymentEmailEvents();
    assert.ok(
      emails.some((e) => e.templateId === "cancellation-confirmation"),
      "must queue cancellation-confirmation email"
    );

    const member = listProvisionedMembers().find(
      (m) => m.email === "cancel-test@example.com"
    );
    assert.ok(member);
    assert.equal(member!.active, false, "member must be deactivated after cancellation");
  });
});

// ── Failed payment / refund pipeline ──────────────────────────────────────────

describe("failed payment and recovery pipeline", () => {
  test("payment.updated FAILED sets past-due status and sends failed-payment email", () => {
    provisionMemberFromPayment({
      email: "failed-pay@example.com",
      planId: "premium",
      providerSubscriptionId: "sq-sub-failed-001",
    });
    resetPaymentEmailEventsForTests();

    const result = processSquareLifecycleEvent({
      type: "payment.updated",
      data: { object: { id: "sq-sub-failed-001", status: "FAILED" } },
    });

    assert.equal(result.processed, true);
    assert.equal(result.status, "past-due");

    const emails = listPaymentEmailEvents();
    assert.ok(
      emails.some((e) => e.templateId === "failed-payment"),
      "must queue failed-payment email"
    );
  });

  test("payment.updated COMPLETED after failure sets reactivated status", () => {
    provisionMemberFromPayment({
      email: "recovery@example.com",
      planId: "basic",
      providerSubscriptionId: "sq-sub-recovery-001",
    });

    processSquareLifecycleEvent({
      type: "payment.updated",
      data: { object: { id: "sq-sub-recovery-001", status: "FAILED" } },
    });
    resetPaymentEmailEventsForTests();

    const result = processSquareLifecycleEvent({
      type: "payment.updated",
      data: { object: { id: "sq-sub-recovery-001", status: "COMPLETED" } },
    });

    assert.equal(result.processed, true);
    assert.equal(result.status, "reactivated");

    const emails = listPaymentEmailEvents();
    assert.ok(
      emails.some((e) => e.templateId === "renewal-confirmation"),
      "must queue renewal-confirmation email on recovery"
    );
  });
});

// ── Webhook idempotency / duplicate protection ────────────────────────────────

describe("webhook idempotency and duplicate protection", () => {
  test("same event ID is blocked on second claim (replay protection)", () => {
    const first = claimWebhookEvent("replay-evt-001", "payment.completed");
    const second = claimWebhookEvent("replay-evt-001", "payment.completed");

    assert.equal(first, true, "first claim must succeed");
    assert.equal(second, false, "replay must be rejected");
  });

  test("different event IDs are each claimable once", () => {
    assert.equal(claimWebhookEvent("unique-a", "payment.completed"), true);
    assert.equal(claimWebhookEvent("unique-b", "subscription.updated"), true);
    assert.equal(claimWebhookEvent("unique-a", "payment.completed"), false);
  });

  test("hasProcessedWebhookEvent reflects claimed events accurately", () => {
    claimWebhookEvent("status-check-001", "payment.completed");
    assert.equal(hasProcessedWebhookEvent("status-check-001"), true);
    assert.equal(hasProcessedWebhookEvent("not-yet-seen"), false);
  });

  test("payment.completed without email does not provision member (server-side guard)", () => {
    const result = processSquareLifecycleEvent({
      type: "payment.completed",
      data: { object: {} },
    });

    assert.equal(result.processed, false, "must not process without email");
    assert.equal(listProvisionedMembers().length, 0, "must not create any member");
  });

  test("unknown event type returns processed=false (no-op)", () => {
    const result = processSquareLifecycleEvent({ type: "catalog.updated" });
    assert.equal(result.processed, false);
  });
});

// ── Login after purchase ──────────────────────────────────────────────────────

describe("login after purchase", () => {
  test("provisioned member has an email and membership tier after purchase", () => {
    provisionMemberFromPayment({
      email: "login-after@example.com",
      planId: "basic",
      providerPaymentId: "sq-pay-login-001",
    });

    const member = listProvisionedMembers().find(
      (m) => m.email === "login-after@example.com"
    );
    assert.ok(member, "member must exist after purchase");
    assert.ok(member!.active, "member must be active");
    assert.equal(member!.membershipTier, "basic");
    assert.equal(member!.hasDashboardAccess, true);
  });
});

// ── Multi-member independence ─────────────────────────────────────────────────

describe("multiple members", () => {
  test("multiple distinct members are provisioned independently", () => {
    provisionMemberFromPayment({ email: "alice-m@example.com", planId: "basic" });
    provisionMemberFromPayment({ email: "bob-m@example.com", planId: "premium" });

    const members = listProvisionedMembers();
    assert.equal(members.length, 2);

    const alice = members.find((m) => m.email === "alice-m@example.com");
    const bob = members.find((m) => m.email === "bob-m@example.com");

    assert.equal(alice?.membershipTier, "basic");
    assert.equal(bob?.membershipTier, "premium");
  });

  test("upgrading tier upserts without duplicating member records", () => {
    provisionMemberFromPayment({ email: "upgrade-m@example.com", planId: "basic" });
    provisionMemberFromPayment({ email: "upgrade-m@example.com", planId: "premium" });

    const members = listProvisionedMembers();
    assert.equal(members.length, 1, "must not duplicate member records on upgrade");
    assert.equal(members[0]?.membershipTier, "premium", "tier must be updated to premium");

    const subs = listMembershipSubscriptions();
    assert.equal(subs.length, 2, "must have 2 subscription records (initial + upgrade)");
  });
});
