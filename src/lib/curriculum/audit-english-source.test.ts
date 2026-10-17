import assert from "node:assert/strict";
import test from "node:test";

import { isEnglishAuditSource } from "@/lib/curriculum/audit-english-source";

test("accepts canonical English marker", () => {
  assert.equal(isEnglishAuditSource("en"), true);
  assert.equal(isEnglishAuditSource("en-US"), true);
});

test("normalizes marker case and surrounding whitespace", () => {
  assert.equal(isEnglishAuditSource(" EN-us "), true);
});

test("rejects non-English evidence for an English audit", () => {
  assert.equal(isEnglishAuditSource("fr-CA"), false);
  assert.equal(isEnglishAuditSource("es-Caribbean"), false);
});

test("rejects absent evidence rather than counting a false PASS", () => {
  assert.equal(isEnglishAuditSource(undefined), false);
  assert.equal(isEnglishAuditSource(null), false);
  assert.equal(isEnglishAuditSource(""), false);
});

test("rejects an unrelated English regional variant for an en-US audit", () => {
  assert.equal(isEnglishAuditSource("en-GB"), false);
});
