import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";

import { createSignedSessionValue } from "@/lib/admin-content/auth";
import { checkLessonAccess, getViewerTierFromCookies } from "@/lib/curriculum/access-gate";

const SECRET = "test-admin-session-secret-0123456789abcdef";

beforeEach(() => {
  process.env.EDUNANCIAL_ADMIN_SESSION_SECRET = SECRET;
});

function forgedUnsignedAdminCookie() {
  const payload = Buffer.from(JSON.stringify({ email: "attacker@example.com", csrfToken: "x", expiresAt: Date.now() + 60_000, role: "owner" })).toString("base64url");
  return `edunancial_admin_session=${payload}.forged`;
}

function signedAdminCookie(role: "admin" | "owner" = "admin", expiresAt = Date.now() + 60_000) {
  return `edunancial_admin_session=${createSignedSessionValue({ email: "owner@example.com", csrfToken: "x", expiresAt, role })}`;
}

describe("curriculum access gate admin bypass", () => {
  test("a forged unsigned admin cookie does not grant admin access", () => {
    assert.equal(getViewerTierFromCookies(forgedUnsignedAdminCookie()), "free");
  });

  test("a forged unsigned admin cookie cannot open a paid lesson", () => {
    const result = checkLessonAccess(5, 1, forgedUnsignedAdminCookie(), "GOLD-L5-001", "en-US");
    assert.equal(result.allowed, false);
    assert.equal(result.viewerTier, "free");
  });

  test("a validly signed admin or owner session keeps the admin bypass", () => {
    assert.equal(getViewerTierFromCookies(signedAdminCookie("admin")), "admin");
    assert.equal(getViewerTierFromCookies(signedAdminCookie("owner")), "admin");
    assert.equal(checkLessonAccess(5, 1, signedAdminCookie(), "GOLD-L5-001", "en-US").allowed, true);
  });

  test("an expired signed session or a non-admin role does not grant admin access", () => {
    assert.equal(getViewerTierFromCookies(signedAdminCookie("admin", Date.now() - 1_000)), "free");
    const member = `edunancial_admin_session=${createSignedSessionValue({ email: "m@example.com", csrfToken: "x", expiresAt: Date.now() + 60_000, role: "member" as never })}`;
    assert.equal(getViewerTierFromCookies(member), "free");
  });
});
