import assert from "node:assert/strict";
import test from "node:test";
import { readVideoStorageConfig, videoMasterKey, videoSourceKey } from "./storage";

test("R2 configuration is all-or-nothing", () => {
  assert.equal(readVideoStorageConfig({} as NodeJS.ProcessEnv), null);
  assert.equal(readVideoStorageConfig({ VIDEO_R2_ENDPOINT: "https://example.invalid" } as NodeJS.ProcessEnv), null);
  assert.deepEqual(readVideoStorageConfig({
    VIDEO_R2_ENDPOINT: "https://example.invalid",
    VIDEO_R2_BUCKET: "edunancial-video",
    VIDEO_R2_ACCESS_KEY_ID: "key",
    VIDEO_R2_SECRET_ACCESS_KEY: "secret",
  } as NodeJS.ProcessEnv), {
    endpoint: "https://example.invalid", bucket: "edunancial-video", accessKeyId: "key", secretAccessKey: "secret",
  });
});

test("storage keys use immutable IDs rather than titles or lesson names", () => {
  assert.equal(videoSourceKey("project-1", "asset-2", ".MP4"), "v1/projects/project-1/sources/asset-2.mp4");
  assert.equal(videoMasterKey("job-3", "lease-4"), "v1/renders/job-3/lease-4/master.mp4");
});
