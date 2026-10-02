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
];

test("Video Maker operational route chain is Neon/object-storage based", () => {
  for (const route of ROUTES) {
    const source = read(route);
    assert.doesNotMatch(source, /getSupabaseAdminClient|@\/lib\/supabase|supabase\.storage|\.from\(["']video_/u, route);
  }

  assert.match(read(ROUTES[0]), /createVideoR2Project/);
  assert.match(read(ROUTES[0]), /presignVideoUpload/);
  assert.match(read(ROUTES[1]), /createVideoR2PendingAsset/);
  assert.match(read(ROUTES[2]), /replaceVideoR2Composition/);
  assert.match(read(ROUTES[2]), /verifyVideoObject/);
  assert.match(read(ROUTES[3]), /createVideoR2Job/);
  assert.match(read(ROUTES[3]), /signWorkerRequest/);
  assert.match(read(ROUTES[4]), /presignVideoDownload/);
});

test("Video Maker repository freezes composition from verified Neon R2 assets", () => {
  const source = read("src/lib/video/repository.ts");
  assert.match(source, /replaceVideoR2Composition/);
  assert.match(source, /getVideoR2FrozenComposition/);
  assert.match(source, /a\.status = 'ready'/);
  assert.match(source, /markVideoR2JobDispatchFailed/);
});
