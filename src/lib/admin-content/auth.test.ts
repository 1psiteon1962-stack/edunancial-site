import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { ADMIN_CSRF_COOKIE, ADMIN_SESSION_COOKIE } from "@/lib/admin-content/config";
import { createSignedSessionValue, hashAdminPassword, parseAdminSessionValue, requireAdminApiSession, verifyAdminPassword } from "@/lib/admin-content/auth";

describe("admin-content auth", () => {
  test("hashes and verifies admin passwords", () => {
    const hash = hashAdminPassword("StrongPass123!");
    assert.equal(verifyAdminPassword("StrongPass123!", hash), true);
    assert.equal(verifyAdminPassword("WrongPass123!", hash), false);
  });

  test("rejects expired signed sessions", () => {
    process.env.EDUNANCIAL_ADMIN_SESSION_SECRET = "12345678901234567890123456789012";
    const signed = createSignedSessionValue({ email: "owner@example.com", csrfToken: "csrf", expiresAt: Date.now() - 1000 });
    assert.equal(parseAdminSessionValue(signed), null);
  });

  test("blocks unauthorized and invalid csrf api access", async () => {
    const unauthorized = await requireAdminApiSession(new Request("https://example.com/api/admin/content/batches"));
    assert.equal(unauthorized.ok, false);
    if (!unauthorized.ok) assert.equal(unauthorized.response.status, 401);

    const signed = createSignedSessionValue({ email: "owner@example.com", csrfToken: "csrf", expiresAt: Date.now() + 60_000 });
    const forbidden = await requireAdminApiSession(new Request("https://example.com/api/admin/content/batches", { method: "POST", headers: { cookie: `${ADMIN_SESSION_COOKIE}=${signed}; ${ADMIN_CSRF_COOKIE}=csrf`, origin: "https://malicious.example", host: "example.com", "x-csrf-token": "csrf" } }), true);
    assert.equal(forbidden.ok, false);
    if (!forbidden.ok) assert.equal(forbidden.response.status, 403);
  });
});
