import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function read(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("completed Video Maker output has an authenticated MP4 attachment endpoint", () => {
  const route = read("src/app/api/admin/video/jobs/[jobId]/download/route.ts");
  assert.match(route, /requireAdminApiSession/);
  assert.match(route, /getVideoR2Job/);
  assert.match(route, /getVideoR2Asset/);
  assert.match(route, /openVideoObject/);
  assert.match(route, /Content-Disposition/);
  assert.match(route, /attachment; filename=/);
  assert.match(route, /Content-Type[\\s\\S]*video\\/mp4/);

  const client = read("src/components/video-studio/MarketingShortClient.tsx");
  assert.match(client, /\/api\/admin\/video\/jobs\/\$\{jobId\}\/download/);
  assert.doesNotMatch(client, /href=\{outputUrl\}[\s\S]{0,250}Download MP4/u);
});

test("Railway worker ffprobes final output before completing the job", () => {
  const worker = read("video-worker/server.mjs");
  assert.match(worker, /capture\("ffprobe"/);
  assert.match(worker, /expected h264/);
  assert.match(worker, /expected aac/);
  assert.match(worker, /expected \$\{expected\[0\]\}x\$\{expected\[1\]\}/);
  const validateIndex = worker.indexOf("await validateMaster(master,c)");
  const uploadIndex = worker.indexOf("new PutObjectCommand({Bucket:bucket,Key:key,Body:data");
  const completeIndex = worker.indexOf("video_r2_complete_job");
  assert.ok(validateIndex >= 0 && uploadIndex > validateIndex, "ffprobe must run before upload");
  assert.ok(completeIndex > uploadIndex, "job completion must occur after validated upload");
});
