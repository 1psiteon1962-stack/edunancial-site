import assert from "node:assert/strict";
import test from "node:test";

import {
  listMembershipSubscriptions,
  processSquareLifecycleEvent,
  resetMembershipLifecycleForTests,
} from "../../../src/lib/payments/membershipLifecycle.ts";
import {
  listPaymentEmailEvents,
  resetPaymentEmailEventsForTests,
} from "../../../src/lib/payments/emailAutomation.ts";

test("payment.completed provisions membership and queues core emails", () => {
  resetMembershipLifecycleForTests();
  resetPaymentEmailEventsForTests();

  const result = processSquareLifecycleEvent({
    type: "payment.completed",
    data: {
      object: {
        customer_email: "member@example.com",
        membership_plan_id: "basic",
        subscription_id: "sq-sub-1",
      },
    },
  });

  assert.equal(result.processed, true);
  assert.equal(result.status, "active");
  assert.ok(result.subscriptionId);
  assert.equal(listMembershipSubscriptions().length, 1);
  assert.equal(listPaymentEmailEvents().length, 4);
});

test("payment failure and retry update lifecycle status", () => {
  resetMembershipLifecycleForTests();
  resetPaymentEmailEventsForTests();

  processSquareLifecycleEvent({
    type: "payment.completed",
    data: {
      object: {
        customer_email: "member2@example.com",
        membership_plan_id: "pro",
        subscription_id: "sq-sub-2",
      },
    },
  });

  const failed = processSquareLifecycleEvent({
    type: "payment.updated",
    data: {
      object: {
        id: "sq-sub-2",
        status: "FAILED",
      },
    },
  });

  assert.equal(failed.processed, true);
  assert.equal(failed.status, "past-due");

  const recovered = processSquareLifecycleEvent({
    type: "payment.updated",
    data: {
      object: {
        id: "sq-sub-2",
        status: "COMPLETED",
      },
    },
  });

  assert.equal(recovered.processed, true);
  assert.equal(recovered.status, "reactivated");
});
