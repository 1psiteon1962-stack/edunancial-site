import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const worker = readFileSync(path.join(process.cwd(), "video-worker/server.mjs"), "utf8");

test("Railway video worker accepts signed per-job dispatch without removing legacy bearer dispatch", () => {
  assert.match(worker, /\/internal\/jobs\/execute/);
  assert.match(worker, /\/internal\\\/jobs\\\/\(\[0-9a-f-\]\{36\}\)\\\/execute/);
  assert.match(worker, /x-edunancial-timestamp/);
  assert.match(worker, /x-edunancial-request-id/);
  assert.match(worker, /x-edunancial-signature/);
  assert.match(worker, /verifySignedDispatch/);
  assert.match(worker, /job id mismatch/);
});
