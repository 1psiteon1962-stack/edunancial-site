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
    "Edunancial is a financial literacy and financial competency membership platform.",
  );
  assert.match(EDUNANCIAL_PUBLIC_DISCLAIMER, /not a school/i);
  assert.match(EDUNANCIAL_PUBLIC_DISCLAIMER, /degree-granting institution/i);
});

test("publishes only the three paid public membership plans", () => {
  assert.deepEqual(
    publicMembershipPlans.map((plan) => plan.name),
    [
      "Individual Membership",
      "Approved Organization Membership",
      "100+ Member Organization Rate",
    ],
  );
  assert.deepEqual(
    publicMembershipPlans.map((plan) => plan.monthlyPrice),
    [19.99, 14.99, 9.99],
  );
  assert.equal(membershipPlans.find((plan) => plan.id === "beta")?.isPublic, false);
});
