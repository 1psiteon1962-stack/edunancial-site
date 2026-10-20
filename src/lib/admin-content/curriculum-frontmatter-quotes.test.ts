import test from "node:test";
import assert from "node:assert/strict";
import { unquoteFrontMatterScalar } from "./curriculum";

test("quoted front matter values are unquoted once", () => {
  assert.equal(unquoteFrontMatterScalar('"Leadership & Executive Management"'), "Leadership & Executive Management");
  assert.equal(unquoteFrontMatterScalar("'Investing'"), "Investing");
  assert.equal(unquoteFrontMatterScalar('"Orchestration: Why It Matters"'), "Orchestration: Why It Matters");
});
test("previously double-encoded values normalize to plain text", () => {
  assert.equal(unquoteFrontMatterScalar('"\\"Paper Assets\\""'), "Paper Assets");
});
test("unquoted values are unchanged", () => {
  assert.equal(unquoteFrontMatterScalar("Business"), "Business");
  assert.equal(unquoteFrontMatterScalar("2026-10-19"), "2026-10-19");
});
