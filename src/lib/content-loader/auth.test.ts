import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  CONTENT_LOADER_CSRF_COOKIE,
  CONTENT_LOADER_SESSION_COOKIE,
  parseContentLoaderSessionValue,
  requireContentLoaderApiSession,
} from "@/lib/content-loader/auth";

import { createHash, createHmac } from "node:crypto";

function createSignedSession(payload: { email: string; csrfToken: string; expiresAt: number }) {
  const configuredSecret =
    process.env.EDUNANCIAL_CONTENT_LOADER_SESSION_SECRET?.trim() ||
    process.env.EDUNANCIAL_ADMIN_SESSION_SECRET?.trim() ||
    createHash("sha256").update("edunancial-content-loader-temporary-session").digest("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", configuredSecret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

describe("content-loader auth", () => {
  test("rejects expired signed sessions", () => {
    process.env.EDUNANCIAL_CONTENT_LOADER_SESSION_SECRET = "12345678901234567890123456789012";
    const signed = createSignedSession({
      email: "loader@example.com",
      csrfToken: "csrf-token",
      expiresAt: Date.now() - 1000,
    });
    assert.equal(parseContentLoaderSessionValue(signed), null);
  });

  test("blocks unauthorized and invalid csrf state-changing access", async () => {
    const unauthorized = await requireContentLoaderApiSession(new Request("https://example.com/api/content-loader/actions"), true);
    assert.equal(unauthorized.ok, false);
    if (!unauthorized.ok) assert.equal(unauthorized.response.status, 401);

    const signed = createSignedSession({
      email: "loader@example.com",
      csrfToken: "csrf-token",
      expiresAt: Date.now() + 60_000,
    });
    const forbidden = await requireContentLoaderApiSession(new Request("https://example.com/api/content-loader/actions", {
      method: "POST",
      headers: {
        cookie: `${CONTENT_LOADER_SESSION_COOKIE}=${signed}; ${CONTENT_LOADER_CSRF_COOKIE}=csrf-token`,
        origin: "https://malicious.example",
        host: "example.com",
        "x-csrf-token": "csrf-token",
      },
    }), true);

    assert.equal(forbidden.ok, false);
    if (!forbidden.ok) assert.equal(forbidden.response.status, 403);
  });
});
