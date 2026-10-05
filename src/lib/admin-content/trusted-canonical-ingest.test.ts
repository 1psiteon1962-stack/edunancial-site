import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const helper = readFileSync(path.join(process.cwd(), "src/lib/admin-content/trusted-canonical-ingest.ts"), "utf8");
const finalizeRoute = readFileSync(path.join(process.cwd(), "src/app/api/admin/content/upload/finalize/route.ts"), "utf8");
const validator = readFileSync(path.join(process.cwd(), "src/lib/admin-content/curriculum-package-validation.ts"), "utf8");

test("trusted canonical curriculum accepts all eight tracks for US English L1 through L5", () => {
  assert.match(helper, /"red", "white", "blue", "green", "gold", "purple", "orange", "black"/u);
  assert.match(helper, /"level-1", "level-2", "level-3", "level-4", "level-5"/u);
  assert.match(helper, /"en", "en-US"/u);
});

test("trusted canonical curriculum requires a complete 50 lesson package before publication", () => {
  assert.match(helper, /validateCompleteCurriculumPackage\(batch, identity\)/u);
  assert.match(validator, /files\.length !== 50/u);
  assert.match(validator, /lessonNumbers\.size !== 50/u);
  assert.match(validator, /Expected exactly 50 unique lessons/u);
  assert.match(validator, /number >= 1 && number <= 50/u);
});

test("trusted canonical curriculum checkpoints runtime state and queues Git export asynchronously", () => {
  assert.match(helper, /options\.publish === false/u);
  assert.match(helper, /upsertPublishedLessonsFromBatch\(batch, \{ requireAtomic: options\.requireAtomic \}\)/u);
  assert.match(helper, /published\.upserted !== 50/u);
  assert.doesNotMatch(helper, /publishBatch\(/u);
  assert.match(finalizeRoute, /autoPublishTrustedCanonicalCurriculumBatch\(batch, packageIdentity, actor, \{ requireAtomic: true \}\)/u);
  assert.match(finalizeRoute, /trustedPublicationAttempted/u);
  assert.doesNotMatch(finalizeRoute, /exportBatchToGithub\(batch\.id, actor\)/u);
  assert.match(finalizeRoute, /githubPublicationPending = trustedPublicationAttempted/u);
  assert.match(finalizeRoute, /GITHUB_EXPORT_PENDING/u);
});

test("finalize retry bypass covers both trusted localized and trusted canonical publication", () => {
  assert.match(finalizeRoute, /const existingReviewBatchId = await getAlreadyFinalizedReviewBatchId\\(batchId, currentUpload\\.uploadId\\);/u);
  assert.doesNotMatch(finalizeRoute, /!trustedLocalized && !trustedCanonical/u);
});
