import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const helper = readFileSync(path.join(process.cwd(), "src/lib/admin-content/trusted-canonical-ingest.ts"), "utf8");
const finalizeRoute = readFileSync(path.join(process.cwd(), "src/app/api/admin/content/upload/finalize/route.ts"), "utf8");

test("trusted canonical curriculum accepts all eight tracks for US English L1 through L5", () => {
  assert.match(helper, /"red", "white", "blue", "green", "gold", "purple", "orange", "black"/u);
  assert.match(helper, /"level-1", "level-2", "level-3", "level-4", "level-5"/u);
  assert.match(helper, /"en", "en-US"/u);
});

test("trusted canonical curriculum derives lesson IDs generically for L1 through L5", () => {\n  assert.match(helper, /`L\\$\\{identity\\.level\\.replace\\("level-", ""\\)\\}`/u);\n});\n\ntest("trusted canonical curriculum requires a complete 50 lesson package before publication", () => {
  assert.match(helper, /canonical\.length !== 50/u);
  assert.match(helper, /lessonNumbers\.size !== 50/u);
  assert.match(helper, /Expected exactly 50 unique lessons/u);
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
