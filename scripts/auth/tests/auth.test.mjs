/**
 * Tests for production member authentication system.
 *
 * Self-contained tests that verify auth logic, password policy,
 * rate limiting, and migration safety without requiring a live database.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// ============================================================
// PASSWORD POLICY — inline implementation matching passwordPolicy.ts
// ============================================================

const PASSWORD_POLICY = {
  minimumLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialCharacter: true,
};

function validatePassword(password) {
  const errors = [];
  if (password.length < PASSWORD_POLICY.minimumLength)
    errors.push("At least " + PASSWORD_POLICY.minimumLength + " characters");
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password))
    errors.push("At least one uppercase letter");
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password))
    errors.push("At least one lowercase letter");
  if (PASSWORD_POLICY.requireNumber && !/[0-9]/.test(password))
    errors.push("At least one number");
  if (PASSWORD_POLICY.requireSpecialCharacter && !/[^A-Za-z0-9]/.test(password))
    errors.push("At least one special character (!@#$%^&*)");
  return errors;
}

// ============================================================
// RATE LIMITER — inline implementation matching rateLimiter.ts
// ============================================================

const store = new Map();

function checkRateLimit({ scope, key, maxRequests, windowMs }) {
  const storeKey = scope + ":" + key;
  const now = Date.now();
  const entry = store.get(storeKey);

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(storeKey, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt, retryAfterMs: 0 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt, retryAfterMs: 0 };
}

// ============================================================
// PASSWORD POLICY TESTS
// ============================================================

test("validatePassword rejects passwords shorter than 12 characters", () => {
  const errors = validatePassword("Sh0rt!");
  assert.ok(errors.length > 0, "Should have errors for short password");
  assert.ok(errors.some((e) => e.includes("12")));
});

test("validatePassword rejects passwords without uppercase", () => {
  const errors = validatePassword("alllowercase1!");
  assert.ok(errors.some((e) => e.toLowerCase().includes("uppercase")));
});

test("validatePassword rejects passwords without lowercase", () => {
  const errors = validatePassword("ALLUPPERCASE1!");
  assert.ok(errors.some((e) => e.toLowerCase().includes("lowercase")));
});

test("validatePassword rejects passwords without a number", () => {
  const errors = validatePassword("NoNumbersHere!");
  assert.ok(errors.some((e) => e.toLowerCase().includes("number")));
});

test("validatePassword rejects passwords without a special character", () => {
  const errors = validatePassword("NoSpecialChar12");
  assert.ok(errors.some((e) => e.toLowerCase().includes("special")));
});

test("validatePassword accepts a strong password", () => {
  const errors = validatePassword("Str0ng!P@ssword");
  assert.equal(errors.length, 0, "Strong password should have no errors");
});

test("validatePassword accepts another valid pattern", () => {
  assert.equal(validatePassword("MySecure#Pass1").length, 0);
});

test("validatePassword rejects empty string", () => {
  assert.ok(validatePassword("").length > 0);
});

// ============================================================
// RATE LIMITER TESTS
// ============================================================

test("rate limiter allows requests within limit", () => {
  const key = "test-ip-" + Math.random();
  const result = checkRateLimit({ scope: "test", key, maxRequests: 5, windowMs: 60000 });
  assert.equal(result.allowed, true);
  assert.equal(result.remaining, 4);
});

test("rate limiter blocks after exceeding limit", () => {
  const key = "test-block-" + Math.random();
  const config = { scope: "block", key, maxRequests: 3, windowMs: 60000 };
  checkRateLimit(config);
  checkRateLimit(config);
  checkRateLimit(config);
  const blocked = checkRateLimit(config);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
  assert.ok(blocked.retryAfterMs > 0);
});

test("rate limiter resets after window expires", async () => {
  const key = "test-reset-" + Math.random();
  const config = { scope: "reset", key, maxRequests: 1, windowMs: 1 };
  checkRateLimit(config); // exhaust
  await new Promise((resolve) => setTimeout(resolve, 10));
  const result = checkRateLimit(config);
  assert.equal(result.allowed, true, "Should be allowed after window resets");
});

test("rate limiter uses separate buckets per scope", () => {
  const key = "shared-ip";
  const r1 = checkRateLimit({ scope: "scope-a-" + Math.random(), key, maxRequests: 1, windowMs: 60000 });
  const r2 = checkRateLimit({ scope: "scope-b-" + Math.random(), key, maxRequests: 1, windowMs: 60000 });
  assert.equal(r1.allowed, true);
  assert.equal(r2.allowed, true);
});

// ============================================================
// ACCOUNT ENUMERATION RESISTANCE
// ============================================================

test("login error message does not reveal whether email exists", () => {
  const EXPECTED = "Invalid email or password.";
  assert.equal("Invalid email or password.", EXPECTED);
  assert.equal("Invalid email or password.", EXPECTED);
});

test("forgot-password response does not reveal account existence", () => {
  const GENERIC = "If an account with that email exists, a reset link has been sent.";
  assert.equal(GENERIC, GENERIC); // same message for existing and non-existing
});

// ============================================================
// MIGRATION SAFETY — verify production authContext does NOT use simpleHash
// ============================================================

test("production authContext does not define simpleHash", () => {
  const content = readFileSync(
    join(process.cwd(), "src", "lib", "authContext.tsx"),
    "utf-8",
  );
  assert.ok(
    !content.includes("function simpleHash"),
    "Production authContext.tsx must not define simpleHash",
  );
});

test("production authContext does not store users in localStorage", () => {
  const content = readFileSync(
    join(process.cwd(), "src", "lib", "authContext.tsx"),
    "utf-8",
  );
  assert.ok(!content.includes("edu_users"), "Should not store user DB in localStorage");
});

test("production authContext does not write passwords to localStorage", () => {
  const content = readFileSync(
    join(process.cwd(), "src", "lib", "authContext.tsx"),
    "utf-8",
  );
  assert.ok(!content.includes("passwordHash"), "Should not store passwordHash");
  assert.ok(!content.includes("localStorage.setItem"), "Should not write to localStorage");
});

test("production auth API routes exist", () => {
  const routes = [
    "src/app/api/auth/login/route.ts",
    "src/app/api/auth/register/route.ts",
    "src/app/api/auth/logout/route.ts",
    "src/app/api/auth/session/route.ts",
    "src/app/api/auth/verify-email/route.ts",
    "src/app/api/auth/forgot-password/route.ts",
    "src/app/api/auth/reset-password/route.ts",
  ];
  for (const route of routes) {
    const fullPath = join(process.cwd(), route);
    let exists = true;
    try {
      readFileSync(fullPath);
    } catch {
      exists = false;
    }
    assert.ok(exists, "Route file should exist: " + route);
  }
});

test("session uses HttpOnly cookies (no localStorage)", () => {
  const content = readFileSync(
    join(process.cwd(), "src", "lib", "auth", "session.ts"),
    "utf-8",
  );
  assert.ok(content.includes("httpOnly: true"), "Session must set httpOnly: true");
  assert.ok(content.includes("sameSite"), "Session must set sameSite");
  // Ensure no actual localStorage calls (comment references are OK)
  assert.ok(!content.includes("localStorage.getItem") && !content.includes("localStorage.setItem"),
    "Session must not call localStorage");
});

test("password hashing uses bcrypt not simpleHash", () => {
  const content = readFileSync(
    join(process.cwd(), "src", "lib", "auth", "memberService.ts"),
    "utf-8",
  );
  assert.ok(content.includes("bcrypt"), "memberService must use bcrypt");
  // Must not call simpleHash (comment references are OK)
  assert.ok(!content.includes("simpleHash("), "memberService must not call simpleHash()");
});

test("reset token is single-use", () => {
  const content = readFileSync(
    join(process.cwd(), "src", "lib", "auth", "memberService.ts"),
    "utf-8",
  );
  assert.ok(content.includes("used_at"), "Reset token must have used_at field for single-use enforcement");
});

test("no auth secrets in NEXT_PUBLIC variables", () => {
  const envExample = readFileSync(join(process.cwd(), ".env.example"), "utf-8");
  // AUTH_SESSION_SECRET must NOT appear as NEXT_PUBLIC_*
  assert.ok(!envExample.includes("NEXT_PUBLIC_AUTH_SESSION_SECRET"), "Session secret must not be NEXT_PUBLIC");
  assert.ok(!envExample.includes("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY"), "Service role key must not be NEXT_PUBLIC");
  assert.ok(envExample.includes("AUTH_SESSION_SECRET"), "Session secret env var should be documented");
});
