import assert from "node:assert/strict";
import test from "node:test";

import { resolveProgressAccessScope, sanitizeMemberApiPayload } from "./api";

test("unauthenticated progress access rejected", () => {
  const result = resolveProgressAccessScope(null);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.status, 401);
});

test("User A cannot read User B progress", () => {
  const result = resolveProgressAccessScope("user-a", "user-b");
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.status, 403);
});

test("User A cannot update User B progress", () => {
  const result = resolveProgressAccessScope("user-a", "user-b");
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.status, 403);
});

test("member APIs do not expose password PIN or token material", () => {
  const sanitized = sanitizeMemberApiPayload({
    email: "member@example.com",
    password: "secret",
    pin_hash: "hashed-pin",
    access_token: "access-token",
    refresh_token: "refresh-token",
  });

  assert.deepEqual(sanitized, { email: "member@example.com" });
});
