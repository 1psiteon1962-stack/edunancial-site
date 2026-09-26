import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

test("Video R2 repository scopes project and job reads to owner", () => {
  const source = readFileSync("src/lib/video/repository.ts", "utf8");
  assert.match(source, /owner_email = \\?\$\{ownerEmail\}/);
  assert.match(source, /join video_r2_projects p on p\.id = j\.project_id/);
  assert.match(source, /p\.owner_email = \\?\$\{ownerEmail\}/);
});

test("Video R2 repository fails closed when database is absent", () => {
  const source = readFileSync("src/lib/video/repository.ts", "utf8");
  assert.match(source, /throw new Error\("Video R2 database is not configured\."\)/);
});


test("Video R2 job creation is owner-scoped and idempotent", () => {
  const source = readFileSync("src/lib/video/repository.ts", "utf8");
  assert.match(source, /p\.id = \\?\$\{input\.projectId\}::uuid and p\.owner_email = \\?\$\{input\.ownerEmail\}/);
  assert.match(source, /on conflict \(idempotency_key\) do nothing/);
  assert.match(source, /j\.idempotency_key = \\?\$\{input\.idempotencyKey\}/);
});
