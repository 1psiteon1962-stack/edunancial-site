import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function read(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("Video Maker readiness is Neon/object-storage/worker based and contains no Supabase dependency", () => {
  const readiness = read("src/app/api/admin/video/readiness/route.ts");
  assert.match(readiness, /getNeonSql/);
  assert.match(readiness, /video_r2_projects/);
  assert.match(readiness, /probeVideoStorageAccess/);
  assert.match(readiness, /neon\+r2\+railway/);
  assert.doesNotMatch(readiness, /supabase|raw-videos|processed-videos/iu);
});

test("Video storage readiness verifies configured object storage instead of creating Supabase buckets", () => {
  const storage = read("src/app/api/admin/video/readiness/storage/route.ts");
  assert.match(storage, /readVideoStorageConfig/);
  assert.match(storage, /probeVideoStorageAccess/);
  assert.match(storage, /VIDEO_R2_ENDPOINT/);
  assert.doesNotMatch(storage, /supabase|createBucket|raw-videos|processed-videos/iu);
});

test("object storage client exposes an authenticated bucket access probe", () => {
  const storageClient = read("src/lib/video/storage-client.ts");
  assert.match(storageClient, /ListObjectsV2Command/);
  assert.match(storageClient, /export async function probeVideoStorageAccess/);
  assert.match(storageClient, /MaxKeys:\s*1/);
});
