import assert from "node:assert/strict";
import test from "node:test";

import {
  membershipPlans,
  publicMembershipPlans,
  resolveMembershipPlanId,
} from "../../../src/types/membership.ts";

test("checkout aliases resolve to canonical membership plans", () => {
  assert.equal(resolveMembershipPlanId("trial"), "beta");
  assert.equal(resolveMembershipPlanId("basic"), "basic");
  assert.equal(resolveMembershipPlanId("pro"), "premium");
  assert.equal(resolveMembershipPlanId("gold"), "enterprise");
});

test("paid public membership plans are purchasable through checkout", () => {
  const paidPlans = publicMembershipPlans.filter((plan) => plan.monthlyPrice > 0);
  assert.ok(paidPlans.length >= 3);
  assert.ok(paidPlans.some((plan) => plan.id === "basic"));
  assert.ok(paidPlans.some((plan) => plan.id === "premium"));
  assert.ok(paidPlans.some((plan) => plan.id === "enterprise"));
  assert.equal(membershipPlans.find((plan) => plan.id === "beta")?.name, "Trial Membership");
});
