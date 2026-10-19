import assert from "node:assert/strict";
import test from "node:test";

import { validateBetaFeedback } from "@/lib/member/beta-feedback";

const complete = { rating: 4, strongestFeature: "Clear lessons", improvementRequest: "More examples", confusingMoment: "Menu", practicalOutcome: "Made a budget" };

test("beta feedback: complete answers are accepted and trimmed", () => {
  const result = validateBetaFeedback({ ...complete, strongestFeature: "  Clear lessons  ", countryRegion: " DO ", additionalNotes: "" });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.fields.strongestFeature, "Clear lessons");
  assert.equal(result.fields.countryRegion, "DO");
  assert.equal(result.fields.additionalNotes, null);
});

test("beta feedback: rating outside 1-5 and missing answers are rejected", () => {
  assert.equal(validateBetaFeedback({ ...complete, rating: 9 }).ok, false);
  assert.equal(validateBetaFeedback({ ...complete, rating: "x" }).ok, false);
  assert.equal(validateBetaFeedback({ ...complete, practicalOutcome: "   " }).ok, false);
});

test("beta feedback: very long answers are capped", () => {
  const result = validateBetaFeedback({ ...complete, improvementRequest: "a".repeat(10_000) });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.fields.improvementRequest.length, 4000);
});
