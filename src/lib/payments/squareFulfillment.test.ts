import assert from "node:assert/strict";
import test from "node:test";

import { fulfillSquareMembershipPayment } from "./squareFulfillment";

test("does not fulfill a payment that is not completed", async () => {
  const result = await fulfillSquareMembershipPayment({
    status: "PENDING",
    order_id: "order-1",
    buyer_email_address: "member@example.com",
  });
  assert.equal(result, false);
});

test("does not fulfill a completed payment without an order", async () => {
  const result = await fulfillSquareMembershipPayment({
    status: "COMPLETED",
    buyer_email_address: "member@example.com",
  });
  assert.equal(result, false);
});

test("does not fulfill a completed payment without a buyer email", async () => {
  const result = await fulfillSquareMembershipPayment({
    status: "COMPLETED",
    order_id: "order-1",
  });
  assert.equal(result, false);
});
