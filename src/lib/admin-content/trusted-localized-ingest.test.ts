import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const helper = readFileSync(
  path.join(process.cwd(), "src/lib/admin-content/trusted-localized-ingest.ts"),
  "utf8",
);
const finalizeRoute = readFileSync(
  path.join(process.cwd(), "src/app/api/admin/content/upload/finalize/route.ts"),
  "utf8",
);
const presignRoute = readFileSync(
  path.join(process.cwd(), "src/app/api/admin/content/upload/presign/route.ts"),
  "utf8",
);

test("trusted localized ingestion supports all eight curriculum tracks", () => {
  assert.match(helper, /"red", "white", "blue", "green", "gold", "purple", "orange", "black"/u);
});

test("trusted localized ingestion supports Levels 1-5 and excludes canonical US English", () => {
  assert.match(helper, /"level-1", "level-2", "level-3", "level-4", "level-5"/u);
  assert.match(helper, /!CANONICAL_ENGLISH\.has\(identity\.language\)/u);
  assert.match(helper, /lessonNumber >= 1 && lessonNumber <= 50/u);
  assert.match(helper, /approvedFiles !== 50/u);
  assert.match(helper, /lessonNumbers\.size !== 50/u);
});

test("trusted localized ingestion republishes and verifies localized translation publication", () => {
  assert.match(helper, /repairAndPublishLocalizedBatch\(batch\)/u);
  assert.match(helper, /localization\.translated !== approvedFiles/u);
  assert.match(helper, /localization\.missingLessonIds\.length > 0/u);
  assert.match(helper, /backfillMissingPublishedLessonsFromRegistry\(\[identity\.track\.toUpperCase\(\)\]\)/u);
  assert.match(finalizeRoute, /autoPublishTrustedLocalizedLevel1Batch\(batch, packageIdentity\)/u);
});

test("presign path uses the server-controlled upload endpoint without Supabase credentials", () => {
  assert.match(presignRoute, /\/api\/admin\/content\/upload\/blob\?/u);
  assert.match(presignRoute, /"x-csrf-token": csrfToken/u);
  assert.match(presignRoute, /signedUrl:\s*null/u);
  assert.doesNotMatch(presignRoute, /SUPABASE|supabase|anonKey|serviceRoleKey/u);
});