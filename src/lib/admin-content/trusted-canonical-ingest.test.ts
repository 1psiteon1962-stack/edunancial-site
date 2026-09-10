import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const helper = readFileSync(path.join(process.cwd(), "src/lib/admin-content/trusted-canonical-ingest.ts"), "utf8");
const finalizeRoute = readFileSync(path.join(process.cwd(), "src/app/api/admin/content/upload/finalize/route.ts"), "utf8");

test("trusted canonical curriculum accepts all eight tracks for US English L2 and L3", () => {
  assert.match(helper, /"red", "white", "blue", "green", "gold", "purple", "orange", "black"/u);
  assert.match(helper, /"level-2", "level-3"/u);
  assert.match(helper, /"en", "en-US"/u);
});

test("trusted canonical curriculum requires a complete 50 lesson package before publication", () => {
  assert.match(helper, /approvedFiles !== 50/u);
  assert.match(helper, /must contain exactly 50 canonical lesson files/u);
  assert.match(helper, /lessonNumber >= 1 && lessonNumber <= 50/u);
});

test("trusted canonical curriculum publishes automatically and requires a GitHub PR", () => {
  assert.match(helper, /publishBatch\(batch\.id, actor\)/u);
  assert.match(helper, /result\.github\?\.pullRequestUrl/u);
  assert.match(finalizeRoute, /autoPublishTrustedCanonicalCurriculumBatch\(batch, packageIdentity, actor\)/u);
});

test("finalize retry bypass covers both trusted localized and trusted canonical publication", () => {
  assert.match(finalizeRoute, /!trustedLocalized && !trustedCanonical/u);
});
