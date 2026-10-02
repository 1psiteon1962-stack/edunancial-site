import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function read(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

const ROUTES = [
  "src/app/api/admin/video/projects/route.ts",
  "src/app/api/admin/video/projects/[projectId]/assets/route.ts",
  "src/app/api/admin/video/projects/[projectId]/composition/route.ts",
  "src/app/api/admin/video/jobs/route.ts",
  "src/app/api/admin/video/jobs/[jobId]/route.ts",
  "src/app/api/admin/video/readiness/route.ts",
  "src/app/api/admin/video/readiness/storage/route.ts",
  "src/app/api/admin/video/smoke-render/route.ts",
];

test("active admin video routes do not depend on Supabase", () => {
  for (const route of ROUTES) {
    const source = read(route);
    assert.doesNotMatch(source, /@\/lib\/supabase|getSupabaseAdminClient|supabase\.storage|\.from\(["']video_/u, route);
  }
});

test("smoke render exercises Neon, R2, and signed Railway dispatch", () => {
  const source = read("src/app/api/admin/video/smoke-render/route.ts");
  assert.match(source, /createVideoR2Project/);
  assert.match(source, /putVideoObject/);
  assert.match(source, /replaceVideoR2Composition/);
  assert.match(source, /createVideoR2Job/);
  assert.match(source, /signWorkerRequest/);
  assert.match(source, /neon\+r2\+railway/);
});
