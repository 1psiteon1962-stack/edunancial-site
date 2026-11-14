import { test } from "node:test";
import assert from "node:assert/strict";
import { redactAuditDetail } from "./redact";

test("removes secrets and emails at any depth and keeps other keys", () => {
  const out = redactAuditDetail({
    lessonId: "BLUE-L1-012",
    token: "abc",
    apiKey: "k",
    nested: { email: "a@example.com", Authorization: "Bearer x", keep: 1, list: [{ password: "p", ok: true }] },
  });
  assert.deepEqual(out, { lessonId: "BLUE-L1-012", nested: { keep: 1, list: [{ ok: true }] } });
});

test("handles key spelling variants", () => {
  const out = redactAuditDetail({ api_key: "x", "access-token": "y", Secret: "z", note: "n" });
  assert.deepEqual(out, { note: "n" });
});

test("empty or missing detail becomes an empty object", () => {
  assert.deepEqual(redactAuditDetail(undefined), {});
  assert.deepEqual(redactAuditDetail(null), {});
});
