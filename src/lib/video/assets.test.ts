import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

test("Video R2 upload lifecycle uses pending assets and direct object storage", () => {
  const source = readFileSync("src/lib/video/assets.ts", "utf8");
  assert.match(source, /createVideoR2PendingAsset/);
  assert.match(source, /presignVideoUpload/);
  assert.match(source, /verifyVideoObject/);
  assert.match(source, /markVideoR2AssetReady/);
  assert.doesNotMatch(source, /Buffer\.from|arrayBuffer\(|request\.body/u);
});

test("Video R2 asset repository is owner scoped and only finalizes pending uploads", () => {
  const source = readFileSync("src/lib/video/repository.ts", "utf8");
  assert.match(source, /p\.owner_email = \$\{input\.ownerEmail\}/);
  assert.match(source, /p\.owner_email = \$\{ownerEmail\}/);
  assert.match(source, /a\.status = 'pending_upload'/);
});
