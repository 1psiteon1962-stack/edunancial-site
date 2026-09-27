import assert from "node:assert/strict";
import test from "node:test";
import { presignVideoDownload, presignVideoUpload } from "./storage-client";
import type { VideoStorageConfig } from "./storage";

const config: VideoStorageConfig = {
  endpoint: "https://example.r2.cloudflarestorage.com",
  bucket: "edunancial-video",
  accessKeyId: "test-access",
  secretAccessKey: "test-secret",
};

test("presigns direct R2 upload without proxying bytes through the app", async () => {
  const url = await presignVideoUpload("v1/projects/p/sources/a.mp4", "video/mp4", 900, undefined, config);
  assert.match(url, /^https:\/\/edunancial-video\.example\.r2\.cloudflarestorage\.com\/v1\/projects\/p\/sources\/a\.mp4\?/u);
  assert.match(url, /X-Amz-Signature=/u);
});

test("presigns direct R2 download", async () => {
  const url = await presignVideoDownload("v1/renders/j/t/master.mp4", 900, undefined, config);
  assert.match(url, /^https:\/\/edunancial-video\.example\.r2\.cloudflarestorage\.com\/v1\/renders\/j\/t\/master\.mp4\?/u);
  assert.match(url, /X-Amz-Signature=/u);
});

test("rejects unsafe signed URL expiries", async () => {
  await assert.rejects(() => presignVideoUpload("x.mp4", "video/mp4", 59, undefined, config), /between 60 and 3600/u);
  await assert.rejects(() => presignVideoDownload("x.mp4", 3601, undefined, config), /between 60 and 3600/u);
});
