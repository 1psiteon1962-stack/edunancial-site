import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { beforeEach, describe, test } from "node:test";

import { NextRequest } from "next/server";
import { createSignedSessionValue } from "@/lib/admin-content/auth";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-content/config";
import { verifyAdminSessionCookie } from "@/lib/admin-content/session-edge";
import { middleware } from "@/middleware";

const SECRET = "test-admin-session-secret-0123456789abcdef";
const OTHER_SECRET = "a-different-secret-0123456789abcdefghijkl";

function b64url(value: string) { return Buffer.from(value).toString("base64url"); }
function signWith(secret: string, payload: string) { return createHmac("sha256", secret).update(payload).digest("base64url"); }
function sessionPayload(overrides: Record<string, unknown> = {}) {
  return b64url(JSON.stringify({ email: "owner@example.com", csrfToken: "csrf-token", expiresAt: Date.now() + 60_000, role: "owner", ...overrides }));
}
function validCookie(overrides: Partial<{ email: string; role: "admin" | "owner"; expiresAt: number }> = {}) {
  return createSignedSessionValue({ email: "owner@example.com", csrfToken: "csrf-token", expiresAt: Date.now() + 60_000, role: "owner", ...overrides });
}
beforeEach(() => { process.env.EDUNANCIAL_ADMIN_SESSION_SECRET = SECRET; });

describe("verifyAdminSessionCookie (edge HMAC verification)", () => {
  test("accepts a cookie signed by the Node session signer (cross-implementation parity)", async () => {
    const result = await verifyAdminSessionCookie(validCookie({ role: "admin" }), SECRET);
    assert.equal(result.valid, true);
    if (result.valid) { assert.equal(result.email, "owner@example.com"); assert.equal(result.role, "admin"); }
  });
  test("accepts a non-ASCII email signed by the Node signer", async () => {
    const result = await verifyAdminSessionCookie(validCookie({ email: "dueño@example.com" }), SECRET);
    assert.equal(result.valid, true); if (result.valid) assert.equal(result.email, "dueño@example.com");
  });
  test("tolerates surrounding whitespace in the configured secret, like auth.ts", async () => {
    const result = await verifyAdminSessionCookie(validCookie(), `  ${SECRET}\n`); assert.equal(result.valid, true);
  });

  const rejections: Array<[string, () => string | undefined, string]> = [
    ["missing cookie", () => undefined, "missing"], ["empty cookie", () => "", "missing"],
    ["unsigned payload without a dot", () => sessionPayload(), "malformed"],
    ["unsigned payload with an empty signature", () => `${sessionPayload()}.`, "malformed"],
    ["three segments", () => `${validCookie()}.extra`, "malformed"],
    ["invalid characters", () => `${sessionPayload()}.abc+/=`, "malformed"],
    ["well-formed payload with a made-up signature", () => `${sessionPayload()}.${b64url("not-a-real-signature-at-all-000000")}`, "bad-signature"],
    ["payload signed with a different secret", () => { const p=sessionPayload(); return `${p}.${signWith(OTHER_SECRET,p)}`; }, "bad-signature"],
    ["tampered payload with the original signature", () => { const signature=validCookie({role:"admin"}).split(".")[1]; return `${sessionPayload({email:"attacker@example.com"})}.${signature}`; }, "bad-signature"],
    ["role escalation by editing the payload", () => { const [payload,signature]=validCookie({role:"admin"}).split("."); const decoded=JSON.parse(Buffer.from(payload,"base64url").toString("utf8")); return `${b64url(JSON.stringify({...decoded,role:"owner"}))}.${signature}`; }, "bad-signature"],
    ["validly signed but not JSON", () => { const p=b64url("not json"); return `${p}.${signWith(SECRET,p)}`; }, "invalid-payload"],
    ["validly signed with a string expiresAt", () => { const p=sessionPayload({expiresAt:"9999999999999"}); return `${p}.${signWith(SECRET,p)}`; }, "invalid-payload"],
    ["validly signed without a csrf token", () => { const p=sessionPayload({csrfToken:""}); return `${p}.${signWith(SECRET,p)}`; }, "invalid-payload"],
    ["validly signed but expired", () => validCookie({expiresAt:Date.now()-1000}), "expired"],
    ["validly signed with no role", () => { const p=sessionPayload({role:undefined}); return `${p}.${signWith(SECRET,p)}`; }, "forbidden-role"],
    ["validly signed with a member role", () => { const p=sessionPayload({role:"member"}); return `${p}.${signWith(SECRET,p)}`; }, "forbidden-role"],
  ];
  for (const [name,makeCookie,reason] of rejections) test(`rejects ${name}`, async()=>{ assert.deepEqual(await verifyAdminSessionCookie(makeCookie(),SECRET),{valid:false,reason}); });
  test("fails closed when the secret is missing or shorter than 32 characters", async () => {
    const cookie=validCookie();
    assert.deepEqual(await verifyAdminSessionCookie(cookie,undefined),{valid:false,reason:"secret-unavailable"});
    assert.deepEqual(await verifyAdminSessionCookie(cookie,""),{valid:false,reason:"secret-unavailable"});
    assert.deepEqual(await verifyAdminSessionCookie(cookie,"short-secret"),{valid:false,reason:"secret-unavailable"});
  });
});

describe("middleware admin gate", () => {
  function request(path:string,cookie?:string){ return new NextRequest(`https://edunancial.com${path}`,{headers:cookie?{cookie:`${ADMIN_SESSION_COOKIE}=${cookie}`}:{}}); }
  function assertRedirectsToLogin(response:Response){ assert.equal(response.status,307); assert.equal(new URL(response.headers.get("location")??"").pathname,"/admin/login"); }
  function assertPassesThrough(response:Response){ assert.equal(response.headers.get("x-middleware-next"),"1"); assert.equal(response.headers.get("location"),null); }
  const forgedUnsignedCookie=`${sessionPayload()}.forged`;
  for(const path of ["/admin","/admin/payments","/admin/marketing/approve","/admin/kpi/export","/cu","/api/cu/publish"]) test(`redirects a forged unsigned cookie on ${path}`,async()=>{assertRedirectsToLogin(await middleware(request(path,forgedUnsignedCookie)));});
  test("redirects when no cookie is present",async()=>{assertRedirectsToLogin(await middleware(request("/admin/payments")));});
  test("redirects an expired signed cookie",async()=>{assertRedirectsToLogin(await middleware(request("/admin/payments",validCookie({expiresAt:Date.now()-1000}))));});
  test("redirects a cookie signed with a different secret",async()=>{const p=sessionPayload();assertRedirectsToLogin(await middleware(request("/admin/payments",`${p}.${signWith(OTHER_SECRET,p)}`)));});
  test("redirects (fails closed) when the session secret is not configured",async()=>{const cookie=validCookie();delete process.env.EDUNANCIAL_ADMIN_SESSION_SECRET;assertRedirectsToLogin(await middleware(request("/admin/payments",cookie)));});
  test("lets a valid signed admin session through",async()=>{assertPassesThrough(await middleware(request("/admin/payments",validCookie({role:"admin"}))));assertPassesThrough(await middleware(request("/admin",validCookie({role:"owner"}))));assertPassesThrough(await middleware(request("/cu",validCookie())));});
  test("keeps the login page and auth API reachable without a session",async()=>{assertPassesThrough(await middleware(request("/admin/login")));assertPassesThrough(await middleware(request("/api/admin/auth/login")));});
  test("does not gate public pages",async()=>{assertPassesThrough(await middleware(request("/blog",forgedUnsignedCookie)));assertPassesThrough(await middleware(request("/courses")));});
});
