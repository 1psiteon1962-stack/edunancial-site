import test from "node:test";
import assert from "node:assert/strict";

import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "./positioning";
import { membershipPlans, publicMembershipPlans } from "../types/membership";

test("uses required legal positioning copy", () => {
  assert.equal(
    EDUNANCIAL_IDENTITY,
    "At Edunancial, we begin with financial literacy, build financial competency, and work toward financial intelligence.",
  );
  assert.match(EDUNANCIAL_PUBLIC_DISCLAIMER, /not a school/i);
  assert.match(EDUNANCIAL_PUBLIC_DISCLAIMER, /degree-granting institution/i);
});

test("publishes only the three paid public membership plans", () => {
  assert.deepEqual(
    publicMembershipPlans.map((plan) => plan.name),
    ["Basic Membership", "Pro Membership", "Gold Membership"],
  );
  assert.deepEqual(
    publicMembershipPlans.map((plan) => plan.monthlyPrice),
    [39.99, 69.99, 99.99],
  );
  assert.equal(membershipPlans.find((plan) => plan.id === "beta")?.isPublic, false);
});
