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

test("trusted localized ingestion is restricted to the five recoverable tracks", () => {
  assert.match(helper, /new Set\(\["gold", "green", "purple", "orange", "black"\]\)/u);
  assert.doesNotMatch(helper, /new Set\([^\n]*"red"/u);
  assert.doesNotMatch(helper, /new Set\([^\n]*"white"/u);
  assert.doesNotMatch(helper, /new Set\([^\n]*"blue"/u);
});

test("trusted localized ingestion supports Levels 1-5 and excludes canonical US English", () => {
  assert.match(helper, /identity\.level === "level-1"/u);
  assert.match(helper, /!CANONICAL_ENGLISH\.has\(identity\.language\)/u);
  assert.match(helper, /lessonNumber >= 1 && lessonNumber <= 50/u);\n  assert.match(helper, /approvedFiles !== 50/u);\n  assert.match(helper, /lessonNumbers\\.size !== 50/u);
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