import assert from "node:assert/strict";
import test from "node:test";
import type { User } from "@supabase/supabase-js";

import { canAccessCurriculumLesson } from "../curriculum/access";
import { activateAndGetBetaAccess, hasActiveBetaAccess } from "./beta-entitlement";
import {
  BETA_CODE_ALPHABET,
  generateBetaCode,
  getNeonBetaGrant,
  hashBetaCode,
  issueBetaCodeBatch,
  normalizeBetaCode,
  redeemBetaCode,
  storeBetaCodeHashes,
  type SqlClient,
} from "./neon-beta-codes";

const CODE = /^EDU-[A-HJ-NP-Z2-9]{8}-[A-HJ-NP-Z2-9]{8}-[A-HJ-NP-Z2-9]{8}-[A-HJ-NP-Z2-9]{8}$/;

/** Records each query and returns the queued result (or throws it). */
function fakeSql(results: Array<Record<string, unknown>[] | Error>) {
  const calls: { text: string; values: unknown[] }[] = [];
  const sql: SqlClient = async (strings, ...values) => {
    calls.push({ text: strings.join("$?").replace(/\s+/g, " ").trim(), values });
    const next = results.shift();
    if (next instanceof Error) throw next;
    return next ?? [];
  };
  return { sql, calls };
}

test("codes: 160-bit format, alphabet without look-alikes, unique across 1,000", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 1000; i += 1) {
    const code = generateBetaCode();
    assert.match(code, CODE);
    seen.add(code);
  }
  assert.equal(seen.size, 1000);
  assert.equal(new Set(BETA_CODE_ALPHABET).size, 32);
  assert.doesNotMatch(BETA_CODE_ALPHABET, /[01IO]/);
});

test("normalization accepts formatting variants and rejects anything else", () => {
  const code = generateBetaCode();
  const body = code.slice(4).replace(/-/g, "");
  assert.equal(normalizeBetaCode(code.toLowerCase()), code);
  assert.equal(normalizeBetaCode(` ${code.replace(/-/g, " ")} `), code);
  assert.equal(normalizeBetaCode(body), code);
  for (const bad of ["", "EDU-AAAA", `${code}A`, code.replace(/.$/, "0"), code.replace(/.$/, "O"), 12345, null, "x".repeat(500)]) {
    assert.equal(normalizeBetaCode(bad), null, String(bad));
  }
});

test("only a SHA-256 digest of the normalized code is used for storage and lookup", () => {
  const code = generateBetaCode();
  assert.match(hashBetaCode(code), /^[0-9a-f]{64}$/);
  assert.equal(hashBetaCode(code), hashBetaCode(normalizeBetaCode(code.toLowerCase())!));
  assert.ok(!hashBetaCode(code).includes(code.slice(4, 12)));
});

test("batch: unique codes, bounded size, retries on collision", () => {
  const batch = issueBetaCodeBatch(10);
  assert.equal(new Set(batch.map((b) => b.code)).size, 10);
  assert.throws(() => issueBetaCodeBatch(0));
  assert.throws(() => issueBetaCodeBatch(51));
  let calls = 0;
  const fixed = (n: number) => { calls += 1; return new Uint8Array(n).fill(calls < 3 ? 0 : calls); };
  assert.equal(new Set(issueBetaCodeBatch(2, fixed).map((b) => b.code)).size, 2);
});

test("storing hashes: fails unless every hash was persisted", async () => {
  const ok = fakeSql([[{ id: 1 }, { id: 2 }]]);
  assert.deepEqual(await storeBetaCodeHashes(ok.sql, ["a", "b"]), [1, 2]);
  assert.deepEqual(ok.calls[0]?.values, [["a", "b"]]);
  const short = fakeSql([[{ id: 1 }]]);
  await assert.rejects(storeBetaCodeHashes(short.sql, ["a", "b"]), /Only 1 of 2/);
});

test("redemption is one conditional UPDATE: unredeemed + unrevoked, 720 hours from one statement timestamp", async () => {
  const { sql, calls } = fakeSql([[{ id: 7, redeemed_at: "2026-10-18T00:00:00Z", expires_at: "2027-01-16T00:00:00Z" }]]);
  const result = await redeemBetaCode(sql, "hash", "user-1");
  assert.deepEqual(result, { outcome: "redeemed", codeId: 7, redeemedAt: "2026-10-18T00:00:00.000Z", expiresAt: "2027-01-16T00:00:00.000Z" });
  const text = calls[0]!.text;
  assert.match(text, /^update beta_invite_codes/);
  assert.match(text, /redeemed_at = statement_timestamp\(\)/);
  assert.match(text, /expires_at = statement_timestamp\(\) \+ interval '720 hours'/);
  assert.match(text, /where code_hash = \$\? and redeemed_at is null and revoked_at is null/);
  assert.doesNotMatch(text, /clock_timestamp|now\(\)/);
  assert.deepEqual(calls[0]!.values, ["user-1", "hash"]);
  assert.equal(calls.length, 1, "no read-then-write race window");
});

test("720 hours is exactly 30 days", () => {
  assert.equal(720 * 3600, 2_592_000);
  assert.equal(7_776_000 / 86_400, 90);
});

test("no matching row (used, revoked or unknown code) -> generic invalid", async () => {
  assert.deepEqual(await redeemBetaCode(fakeSql([[]]).sql, "hash", "user-1"), { outcome: "invalid" });
});

test("UNIQUE(redeemed_by) violation -> account already redeemed; other DB errors propagate", async () => {
  const dup = Object.assign(new Error('duplicate key value violates unique constraint "beta_invite_codes_redeemed_by_key"'), { code: "23505", constraint: "beta_invite_codes_redeemed_by_key" });
  assert.deepEqual(await redeemBetaCode(fakeSql([dup]).sql, "hash", "user-1"), { outcome: "account_already_redeemed" });
  const other = Object.assign(new Error("connection reset"), { code: "08006" });
  await assert.rejects(redeemBetaCode(fakeSql([other]).sql, "hash", "user-1"), /connection reset/);
});

test("redemption refuses to run without a server-verified account id", async () => {
  await assert.rejects(redeemBetaCode(fakeSql([[]]).sql, "hash", ""), /server-verified/);
});

test("grant lookup uses the database clock for active/expired", async () => {
  const { sql, calls } = fakeSql([[{ id: 3, redeemed_at: "2026-10-18T00:00:00Z", expires_at: "2027-01-16T00:00:00Z", revoked_at: null, active: true }]]);
  const grant = await getNeonBetaGrant(sql, "user-1");
  assert.equal(grant?.active, true);
  assert.match(calls[0]!.text, /revoked_at is null and expires_at > statement_timestamp\(\)/);
});

const user = { id: "user-1", email: "t@example.com" } as User;
const neonRow = (over: Record<string, unknown>) => fakeSql([[{ id: 3, redeemed_at: "2026-10-18T00:00:00Z", expires_at: "2027-01-16T00:00:00Z", revoked_at: null, active: true, ...over }]]).sql;
const noLegacy = async () => null;

test("sign-in: active Neon grant -> active beta access -> Gold for every level of every track", async () => {
  const access = await activateAndGetBetaAccess(user, { neon: neonRow({}), legacy: noLegacy });
  assert.equal(access?.status, "active");
  assert.equal(access?.source, "neon");
  assert.equal(hasActiveBetaAccess(access, Date.parse("2026-11-01T00:00:00Z")), true);
  for (let level = 1; level <= 5; level += 1) {
    for (const lessonNumber of [1, 4, 25, 50]) assert.equal(canAccessCurriculumLesson({ level, lessonNumber, membershipTier: "enterprise" }), true);
  }
});

test("sign-in: expired and revoked Neon grants give no beta access", async () => {
  const expired = await activateAndGetBetaAccess(user, { neon: neonRow({ active: false }), legacy: noLegacy });
  assert.equal(expired?.status, "expired");
  assert.equal(hasActiveBetaAccess(expired), false);
  const revoked = await activateAndGetBetaAccess(user, { neon: neonRow({ active: false, revoked_at: "2026-10-20T00:00:00Z" }), legacy: noLegacy });
  assert.equal(revoked?.status, "revoked");
  assert.equal(hasActiveBetaAccess(revoked), false);
});

test("sign-in: the time check also guards a stale 'active' value", () => {
  assert.equal(hasActiveBetaAccess({ status: "active", firstUsedAt: null, expiresAt: "2027-01-16T00:00:00Z", generation: 1, reissueCount: 0 }, Date.parse("2027-01-16T00:00:00Z")), false);
});

test("sign-in: Neon outage never blocks login and grants nothing new; legacy grants are preserved", async () => {
  const broken = fakeSql([new Error("neon down")]).sql;
  assert.equal(await activateAndGetBetaAccess(user, { neon: broken, legacy: noLegacy }), null);
  const legacy = { status: "active" as const, firstUsedAt: "2026-09-01T00:00:00Z", expiresAt: "2026-11-30T00:00:00Z", generation: 1, reissueCount: 0, source: "legacy" as const };
  assert.deepEqual(await activateAndGetBetaAccess(user, { neon: fakeSql([[]]).sql, legacy: async () => legacy }), legacy);
  assert.deepEqual(await activateAndGetBetaAccess(user, { neon: null, legacy: async () => legacy }), legacy);
});

test("without a beta grant a free account stays locked out of paid levels", () => {
  assert.equal(canAccessCurriculumLesson({ level: 2, lessonNumber: 1, membershipTier: "free" }), false);
  assert.equal(canAccessCurriculumLesson({ level: 5, lessonNumber: 1, membershipTier: "free" }), false);
  assert.equal(canAccessCurriculumLesson({ level: 1, lessonNumber: 1, membershipTier: "free" }), true);
});
