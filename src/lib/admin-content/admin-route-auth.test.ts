import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, test } from "node:test";

import { GET as exportKpis } from "@/app/admin/kpi/export/route";
import { POST as approveMarketing } from "@/app/admin/marketing/approve/route";
import { createSignedSessionValue } from "@/lib/admin-content/auth";
import { ADMIN_CSRF_COOKIE, ADMIN_SESSION_COOKIE } from "@/lib/admin-content/config";

const SECRET = "test-admin-session-secret-0123456789abcdef";
const saved = {
  secret: process.env.EDUNANCIAL_ADMIN_SESSION_SECRET,
  token: process.env.ADMIN_METRICS_TOKEN,
  databaseUrl: process.env.DATABASE_URL,
  netlifyDatabaseUrl: process.env.NETLIFY_DATABASE_URL,
};

function restore(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

beforeEach(() => {
  process.env.EDUNANCIAL_ADMIN_SESSION_SECRET = SECRET;
  delete process.env.ADMIN_METRICS_TOKEN;
  delete process.env.DATABASE_URL;
  delete process.env.NETLIFY_DATABASE_URL;
});

afterEach(() => {
  restore("EDUNANCIAL_ADMIN_SESSION_SECRET", saved.secret);
  restore("ADMIN_METRICS_TOKEN", saved.token);
  restore("DATABASE_URL", saved.databaseUrl);
  restore("NETLIFY_DATABASE_URL", saved.netlifyDatabaseUrl);
});

function signedSession(role: "admin" | "owner" = "admin") {
  return createSignedSessionValue({ email: "owner@example.com", csrfToken: "csrf-token", expiresAt: Date.now() + 60_000, role });
}

const forgedUnsignedSession = `${Buffer.from(JSON.stringify({ email: "attacker@example.com", csrfToken: "csrf-token", expiresAt: Date.now() + 60_000, role: "owner" })).toString("base64url")}.forged`;

function approveRequest(session: string | null, options: { csrfHeader?: string; origin?: string } = {}) {
  const headers: Record<string, string> = { "content-type": "application/json", host: "edunancial.com" };
  if (session) headers.cookie = `${ADMIN_SESSION_COOKIE}=${session}; ${ADMIN_CSRF_COOKIE}=csrf-token`;
  if (options.csrfHeader !== undefined) headers["x-csrf-token"] = options.csrfHeader;
  headers.origin = options.origin ?? "https://edunancial.com";
  return new Request("https://edunancial.com/admin/marketing/approve", {
    method: "POST", headers,
    body: JSON.stringify({ publicationIds: ["00000000-0000-0000-0000-000000000001"], approvedBy: "spoofed@example.com" }),
  });
}

function exportRequest(session: string | null, token?: string) {
  const headers: Record<string, string> = {};
  if (session) headers.cookie = `${ADMIN_SESSION_COOKIE}=${session}`;
  if (token) headers.authorization = `Bearer ${token}`;
  return new Request("https://edunancial.com/admin/kpi/export", { headers });
}

describe("POST /admin/marketing/approve verifies the admin session itself", () => {
  test("rejects a request with no session (401)", async () => { assert.equal((await approveMarketing(approveRequest(null, { csrfHeader: "csrf-token" }))).status, 401); });
  test("rejects a forged unsigned session cookie (401)", async () => { assert.equal((await approveMarketing(approveRequest(forgedUnsignedSession, { csrfHeader: "csrf-token" }))).status, 401); });
  test("rejects a valid session without the CSRF header (403)", async () => { assert.equal((await approveMarketing(approveRequest(signedSession()))).status, 403); });
  test("rejects a valid session from a foreign origin (403)", async () => { assert.equal((await approveMarketing(approveRequest(signedSession(), { csrfHeader: "csrf-token", origin: "https://evil.example" }))).status, 403); });
  test("a valid session with CSRF passes authentication (then stops at the missing database, 503)", async () => { assert.equal((await approveMarketing(approveRequest(signedSession(), { csrfHeader: "csrf-token" }))).status, 503); });
});

describe("GET /admin/kpi/export verifies the admin session itself", () => {
  test("rejects a request with no session (401)", async () => { assert.equal((await exportKpis(exportRequest(null))).status, 401); });
  test("rejects a forged unsigned session cookie (401)", async () => { assert.equal((await exportKpis(exportRequest(forgedUnsignedSession))).status, 401); });
  test("allows a valid signed session when no metrics token is configured (200)", async () => {
    const response = await exportKpis(exportRequest(signedSession("owner")));
    assert.equal(response.status, 200); assert.match(response.headers.get("content-type") ?? "", /text\/csv/);
  });
  test("still requires the metrics token when one is configured", async () => {
    process.env.ADMIN_METRICS_TOKEN = "metrics-token-0123456789";
    assert.equal((await exportKpis(exportRequest(signedSession()))).status, 401);
    assert.equal((await exportKpis(exportRequest(signedSession(), "wrong-token"))).status, 401);
    assert.equal((await exportKpis(exportRequest(signedSession(), "metrics-token-0123456789"))).status, 200);
  });
  test("a metrics token alone, without a signed session, is rejected (401)", async () => {
    process.env.ADMIN_METRICS_TOKEN = "metrics-token-0123456789";
    assert.equal((await exportKpis(exportRequest(null, "metrics-token-0123456789"))).status, 401);
    assert.equal((await exportKpis(exportRequest(forgedUnsignedSession, "metrics-token-0123456789"))).status, 401);
  });
});
