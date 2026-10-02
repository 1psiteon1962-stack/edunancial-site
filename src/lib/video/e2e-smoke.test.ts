import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function read(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("production video smoke covers image narration music render and download validation", () => {
  const smoke = read("src/app/api/admin/video/smoke-render/route.ts");
  assert.match(smoke, /createSmokeMusicWav/);
  assert.match(smoke, /kind: "music"/);
  assert.match(smoke, /role: "music"/);
  assert.match(smoke, /volume: 0\.08/);
  assert.match(smoke, /getVideoR2Job/);
  assert.match(smoke, /getVideoR2Asset/);
  assert.match(smoke, /verifyVideoObject/);
  assert.match(smoke, /downloadUrl:/);
  assert.match(smoke, /backgroundMusic: true/);
  assert.match(smoke, /status: "succeeded"/);
});

test("production video smoke remains off Supabase", () => {
  const smoke = read("src/app/api/admin/video/smoke-render/route.ts");
  assert.doesNotMatch(smoke, /supabase|getSupabaseAdminClient|raw-videos|processed-videos/iu);
});
