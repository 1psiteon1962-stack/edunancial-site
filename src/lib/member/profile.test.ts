import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeProfileUpdate } from "./profile";

test("client cannot self-promote membership tier", () => {
  const sanitized = sanitizeProfileUpdate({
    firstName: "Taylor",
    membershipTier: "enterprise",
  });

  assert.equal("membership_tier" in sanitized, false);
  assert.equal(sanitized.first_name, "Taylor");
});
