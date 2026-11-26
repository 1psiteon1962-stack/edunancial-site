import test from "node:test";
import assert from "node:assert/strict";

import { validateFactSheet, type JurisdictionFactSheet } from "./fact-sheet";
import { getRolloutEntry, getRolloutWave, isActivationHeld, ROLLOUT } from "./rollout";

test("rollout starts with US and Canada, then heads south", () => {
  assert.deepEqual(getRolloutWave(0).map((e) => e.code), ["US", "CA"]);
  assert.deepEqual(getRolloutWave(1).map((e) => e.code), ["MX", "PR", "DO"]);
  assert.equal(getRolloutEntry("pa")?.wave, 2);
  assert.equal(getRolloutEntry("CO")?.wave, 3);
  assert.equal(getRolloutEntry("JM")?.wave, 4);
});

test("rollout has no duplicate countries", () => {
  const codes = ROLLOUT.map((e) => e.code);
  assert.equal(new Set(codes).size, codes.length);
});

test("Cuba is fully prepared in the rollout but held from activation", () => {
  assert.equal(getRolloutEntry("CU")?.wave, 4);
  assert.equal(isActivationHeld("CU"), true);
  assert.equal(isActivationHeld("DO"), false);
});

const validSheet: JurisdictionFactSheet = {
  code: "XX",
  name: "Example",
  lastReviewedAt: "2026-11-26",
  sources: [{ id: "s1", jurisdiction: "XX", authority: "Tax Authority", title: "Law", url: "https://example.gov/law", sourceType: "legislation" }],
  entityForms: [{ localName: "Example LLC", archetype: "limited-liability-company", sourceIds: ["s1"] }],
  consumptionTaxes: [{ localName: "Example VAT", archetype: "vat", sourceIds: ["s1"] }],
  rules: [{ id: "r1", jurisdiction: "XX", topics: ["business-formation"], statement: "Example.", sourceIds: ["s1"], effectiveFrom: "2026-01-01", risk: "green", verificationStatus: "verified", confidence: 0.9 }],
};

test("a complete fact sheet validates", () => {
  assert.deepEqual(validateFactSheet(validSheet), []);
});

test("fact sheet rejects unsourced, undated, or unknown-topic rules", () => {
  const bad: JurisdictionFactSheet = {
    ...validSheet,
    rules: [{ ...validSheet.rules[0], sourceIds: ["missing"], effectiveFrom: undefined, topics: ["made-up"] }],
  };
  const problems = validateFactSheet(bad).join("\n");
  assert.match(problems, /unknown source missing/);
  assert.match(problems, /effectiveFrom/);
  assert.match(problems, /unknown topic made-up/);
});
