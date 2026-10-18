import test from "node:test";
import assert from "node:assert/strict";
import { validateCoordinateResponse } from "./audit-response-validation.mjs";

const job = { track: "RED", level: 1, locale: "fr-CA" };
const good = () => ({
  track: "RED", level: 1, locale: "fr-CA", expectedLessonCount: 50,
  discoveredLessonCount: 50, retrievableLessonCount: 50,
  englishFallbackLessonCount: 0, missingLessonIDs: [],
  englishFallbackLessonIDs: [], firstLessonRetrievable: true,
  lastLessonRetrievable: true, runtimeStatus: "PASS", failures: [],
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

function oneMissing() {
  return { ...good(), retrievableLessonCount: 49,
    missingLessonIDs: ["RED-L1-050"], lastLessonRetrievable: false,
    runtimeStatus: "FAIL", failures: [{ lessonId: "RED-L1-050", disappearsAt: "not retrievable" }] };
}

test("accepts coherent FAIL with exact missing canonical ID evidence", () => {
  assert.deepEqual(validateCoordinateResponse(response(oneMissing()), job), oneMissing());
});

test("rejects a false loss report where 49 successes and no missing IDs account for 50", () => {
  assert.throws(() => validateCoordinateResponse(response({ ...oneMissing(), missingLessonIDs: [], failures: [] }), job), /contradict/);
});

test("rejects cross-level missing ID in a supposedly valid FAIL", () => {
  assert.throws(() => validateCoordinateResponse(response({ ...oneMissing(), missingLessonIDs: ["RED-L2-050"] }), job), /contradict/);
});

test("rejects duplicate lesson IDs masking loss", () => {
  assert.throws(() => validateCoordinateResponse(response({ ...oneMissing(), missingLessonIDs: ["RED-L1-050", "RED-L1-050"] }), job), /contradict/);
});

test("rejects fallback count/ID contradictions", () => {
  const bad = { ...oneMissing(), missingLessonIDs: [], englishFallbackLessonCount: 1,
    englishFallbackLessonIDs: [], failures: [] };
  assert.throws(() => validateCoordinateResponse(response(bad), job), /contradict/);
});

test("rejects diagnostics that cite an unrelated lesson", () => {
  assert.throws(() => validateCoordinateResponse(response({ ...oneMissing(), failures: [{ lessonId: "RED-L1-049" }] }), job), /contradict/);
});

test("rejects false PASS with omitted failure evidence array", () => {
  const { failures, ...incomplete } = good();
  assert.throws(() => validateCoordinateResponse(response(incomplete), job), /contradict/);
});

test("accepts coherent FAIL mixing missing and English-fallback lessons (server shape)", () => {
  const mixed = { ...good(), discoveredLessonCount: 49, retrievableLessonCount: 47,
    englishFallbackLessonCount: 1, missingLessonIDs: ["RED-L1-001", "RED-L1-050"],
    englishFallbackLessonIDs: ["RED-L1-025"], firstLessonRetrievable: false, lastLessonRetrievable: false,
    runtimeStatus: "FAIL", failures: [{ lessonId: "RED-L1-001" }, { lessonId: "RED-L1-050" }, { lessonId: "RED-L1-025" }] };
  assert.deepEqual(validateCoordinateResponse(response(mixed), job), mixed);
});

test("rejects a lesson reported as both missing and English fallback", () => {
  const overlap = { ...oneMissing(), retrievableLessonCount: 48, englishFallbackLessonCount: 1,
    englishFallbackLessonIDs: ["RED-L1-050"], failures: [{ lessonId: "RED-L1-050" }, { lessonId: "RED-L1-049" }] };
  assert.throws(() => validateCoordinateResponse(response(overlap), job), /contradict/);
});

test("rejects missing first lesson reported as retrievable", () => {
  const bad = { ...oneMissing(), missingLessonIDs: ["RED-L1-001"], lastLessonRetrievable: true,
    firstLessonRetrievable: true, failures: [{ lessonId: "RED-L1-001" }] };
  assert.throws(() => validateCoordinateResponse(response(bad), job), /first\/last lesson flags/);
});

test("rejects missing last lesson reported as retrievable", () => {
  assert.throws(() => validateCoordinateResponse(response({ ...oneMissing(), lastLessonRetrievable: true }), job), /first\/last lesson flags/);
});

test("rejects a middle-lesson loss that falsely marks the first lesson unavailable", () => {
  const bad = { ...oneMissing(), missingLessonIDs: ["RED-L1-025"], lastLessonRetrievable: true,
    firstLessonRetrievable: false, failures: [{ lessonId: "RED-L1-025" }] };
  assert.throws(() => validateCoordinateResponse(response(bad), job), /first\/last lesson flags/);
});

test("accepts a middle-lesson loss with both endpoints retrievable", () => {
  const ok = { ...oneMissing(), missingLessonIDs: ["RED-L1-025"], lastLessonRetrievable: true,
    firstLessonRetrievable: true, failures: [{ lessonId: "RED-L1-025" }] };
  assert.deepEqual(validateCoordinateResponse(response(ok), job), ok);
});
