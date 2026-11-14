import test from "node:test";
import assert from "node:assert/strict";
import { ownerMemberAccess, hasActiveBetaAccess } from "./beta-entitlement";

const env = { EDUNANCIAL_OWNER_EMAIL: "owner@example.com", EDUNANCIAL_ADMIN_EMAIL: "Admin@Example.com" };

test("owner and admin member accounts get permanent full access", () => {
  for (const email of ["owner@example.com", "ADMIN@example.com"]) {
    const access = ownerMemberAccess({ email, email_confirmed_at: "2026-01-01T00:00:00Z" }, env);
    assert.equal(hasActiveBetaAccess(access), true);
    assert.equal(access?.source, "owner");
  }
});
test("unconfirmed or other emails get no owner access", () => {
  assert.equal(ownerMemberAccess({ email: "owner@example.com", email_confirmed_at: undefined }, env), null);
  assert.equal(ownerMemberAccess({ email: "someone@example.com", email_confirmed_at: "2026-01-01T00:00:00Z" }, env), null);
  assert.equal(ownerMemberAccess({ email: "owner@example.com", email_confirmed_at: "2026-01-01T00:00:00Z" }, {}), null);
});

test("owner member email list grants access to each listed account", () => {
  const listEnv = { EDUNANCIAL_OWNER_MEMBER_EMAILS: " first@example.com, Second@Example.com ,third@example.com" };
  for (const email of ["first@example.com", "second@example.com", "THIRD@example.com"]) {
    const access = ownerMemberAccess({ email, email_confirmed_at: "2026-01-01T00:00:00Z" }, listEnv);
    assert.equal(hasActiveBetaAccess(access), true, email);
  }
  assert.equal(ownerMemberAccess({ email: "fourth@example.com", email_confirmed_at: "2026-01-01T00:00:00Z" }, listEnv), null);
  assert.equal(ownerMemberAccess({ email: "first@example.com", email_confirmed_at: undefined }, listEnv), null);
});
