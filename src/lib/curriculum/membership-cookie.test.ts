import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { signTier, verifyTierCookie } from "./membership-cookie";

const originalSecret = process.env.EDUNANCIAL_CURRICULUM_SECRET;

beforeEach(() => {
  process.env.EDUNANCIAL_CURRICULUM_SECRET = "12345678901234567890123456789012-cookie-secret";
});

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.EDUNANCIAL_CURRICULUM_SECRET;
  } else {
    process.env.EDUNANCIAL_CURRICULUM_SECRET = originalSecret;
  }
});

test("entitlement cookie cannot be forged", () => {
  const signed = signTier("basic");
  const forged = signed.replace("basic", "gold");
  assert.equal(verifyTierCookie(forged), null);
});

test("missing production signing secret fails closed", () => {
  delete process.env.EDUNANCIAL_CURRICULUM_SECRET;
  assert.equal(verifyTierCookie("basic.bad-signature"), null);
});
