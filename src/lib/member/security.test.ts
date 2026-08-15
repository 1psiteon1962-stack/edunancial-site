import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import {
  computePinFailureState,
  hashSecurityPin,
  validateSecurityPin,
  verifySecurityPinHash,
} from "./security";

const originalPepper = process.env.EDUNANCIAL_MEMBER_PIN_PEPPER;

beforeEach(() => {
  process.env.EDUNANCIAL_MEMBER_PIN_PEPPER = "12345678901234567890123456789012-test-pepper";
});

afterEach(() => {
  if (originalPepper === undefined) {
    delete process.env.EDUNANCIAL_MEMBER_PIN_PEPPER;
  } else {
    process.env.EDUNANCIAL_MEMBER_PIN_PEPPER = originalPepper;
  }
});

test("invalid PIN rejected", () => {
  assert.equal(validateSecurityPin("12ab56"), "PIN must be exactly 6 numeric digits.");
});

test("weak sequential PIN rejected", () => {
  assert.match(validateSecurityPin("123456") ?? "", /too weak/i);
});

test("PIN hash differs from raw PIN", () => {
  const hash = hashSecurityPin("482915");
  assert.notEqual(hash, "482915");
});

test("PIN verification works", () => {
  const hash = hashSecurityPin("482915");
  assert.equal(verifySecurityPinHash("482915", hash), true);
  assert.equal(verifySecurityPinHash("482916", hash), false);
});

test("PIN lockout works", () => {
  let state = computePinFailureState(4);
  assert.equal(state.locked, true);
  assert.ok(state.lockedUntil);
});
