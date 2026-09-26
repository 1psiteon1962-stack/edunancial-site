import test from "node:test";
import assert from "node:assert/strict";
import { classifyTranslationQuality, isLearnerReadyStatus } from "../lib/quality.mjs";

test("quality classifier distinguishes missing placeholder template and complete content",()=>{
  assert.equal(classifyTranslationQuality({body:""}),"missing");
  assert.equal(classifyTranslationQuality({body:"Localized curriculum content for RED Level 2 lesson 020"}),"placeholder");
  assert.equal(classifyTranslationQuality({body:"Short summary",canonicalBody:"x".repeat(4000)}),"template");
  assert.equal(classifyTranslationQuality({body:"x".repeat(2500),canonicalBody:"y".repeat(4000)}),"machine-validated");
});
test("reviewed content is learner ready while template content is not",()=>{
  assert.equal(classifyTranslationQuality({body:"Complete human translation",explicitStatus:"reviewed"}),"reviewed");
  assert.equal(isLearnerReadyStatus("reviewed"),true);
  assert.equal(isLearnerReadyStatus("template"),false);
});
