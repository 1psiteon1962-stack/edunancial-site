import test from "node:test";
import assert from "node:assert/strict";
import { validateCoordinateResponse } from "./audit-response-validation.mjs";

const job = { track: "RED", level: 1, locale: "fr-CA" };
const good = () => ({
  track: "RED", level: 1, locale: "fr-CA", expectedLessonCount: 50,
  discoveredLessonCount: 50, retrievableLessonCount: 50,
  englishFallbackLessonCount: 0, missingLessonIDs: [],
  englishFallbackLessonIDs: [], firstLessonRetrievable: true,
  lastLessonRetrievable: true, runtimeStatus: "PASS",
});
const response = (coordinate) => ({ coordinates: [coordinate] });

test("accepts complete matching coordinate", () => {
  assert.deepEqual(validateCoordinateResponse(response(good()), job), good());
});
test("rejects empty HTTP 200 coordinates", () => {
  assert.throws(() => validateCoordinateResponse({ coordinates: [] }, job));
});
test("rejects mismatched coordinate", () => {
  assert.throws(() => validateCoordinateResponse(response({ ...good(), locale: "en-US" }), job));
});
test("rejects false PASS when discovery is incomplete", () => {
  assert.throws(() => validateCoordinateResponse(response({ ...good(), discoveredLessonCount: 49 }), job));
});
test("rejects false PASS with English fallback", () => {
  assert.throws(() => validateCoordinateResponse(response({ ...good(), englishFallbackLessonCount: 1 }), job));
});
test("rejects false PASS with missing lesson IDs", () => {
  assert.throws(() => validateCoordinateResponse(response({ ...good(), missingLessonIDs: ["RED-L1-050"] }), job));
});
test("rejects false PASS when final lesson is unavailable", () => {
  assert.throws(() => validateCoordinateResponse(response({ ...good(), lastLessonRetrievable: false }), job));
});
test("rejects false FAIL when all evidence says PASS", () => {
  assert.throws(() => validateCoordinateResponse(response({ ...good(), runtimeStatus: "FAIL" }), job));
});
