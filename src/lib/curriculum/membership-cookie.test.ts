import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { createHmac } from "node:crypto";

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

const SECRET = "12345678901234567890123456789012-cookie-secret";
const NOW = 1_800_000_000;

test("valid cookie verifies until its signed expiry", () => {
  const cookie = signTier("gold", NOW + 3600);
  assert.equal(verifyTierCookie(cookie, NOW), "gold");
  assert.equal(verifyTierCookie(cookie, NOW + 3599), "gold");
});

test("a saved Gold cookie is rejected at and after its signed expiry (replay after day 90)", () => {
  const betaEnd = NOW + 90 * 24 * 3600;
  const cookie = signTier("gold", betaEnd);
  assert.equal(verifyTierCookie(cookie, betaEnd - 1), "gold");
  assert.equal(verifyTierCookie(cookie, betaEnd), null);
  assert.equal(verifyTierCookie(cookie, betaEnd + 86400), null);
});

test("extending the expiry in the cookie breaks the signature", () => {
  const cookie = signTier("gold", NOW + 60);
  const [tier, , sig] = cookie.split(".");
  assert.equal(verifyTierCookie(`${tier}.${NOW + 999999}.${sig}`, NOW), null);
});

test("legacy unexpiring cookie format is no longer accepted, even with a valid old signature", () => {
  const legacySig = createHmac("sha256", SECRET).update("gold").digest("base64url");
  assert.equal(verifyTierCookie(`gold.${legacySig}`, NOW), null);
});

test("malformed expiry and unknown tiers are rejected", () => {
  for (const bad of ["gold.abc.sig", "gold.-5.sig", "gold..sig", "platinum.9999999999.sig", "gold.1.2.3", ""]) {
    assert.equal(verifyTierCookie(bad, NOW), null, bad);
  }
});

test("default lifetime for paid tiers stays 30 days", () => {
  const cookie = signTier("pro");
  const exp = Number(cookie.split(".")[1]);
  const expected = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
  assert.ok(Math.abs(exp - expected) <= 5);
});
