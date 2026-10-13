import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const sql=readFileSync(path.join(process.cwd(),"db/neon/20261013_video_founder_approval_publish_gate.sql"),"utf8");

test("publishing is impossible without explicit founder approval",()=>{
  assert.match(sql,/review_status <> 'approved'/);
  assert.match(sql,/founder_approval_required/);
  assert.match(sql,/approved_asset_id IS NULL/);
  assert.match(sql,/approved_sha256 IS NULL/);
});

test("approval is bound to immutable rendered bytes",()=>{
  assert.match(sql,/a\.sha256 IS DISTINCT FROM p\.approved_sha256/);
  assert.match(sql,/approved_asset_changed/);
});

test("platform publication is idempotent and auditable",()=>{
  assert.match(sql,/idempotency_key text NOT NULL UNIQUE/);
  assert.match(sql,/remote_post_id/);
  assert.match(sql,/remote_url/);
  assert.match(sql,/attempts integer NOT NULL DEFAULT 0/);
  assert.match(sql,/last_error/);
});
