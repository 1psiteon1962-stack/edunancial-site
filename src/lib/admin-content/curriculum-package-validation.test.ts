import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";

test("canonical and localized ingest share the same complete-package validator", () => {
  const canonical = readFileSync(path.join(process.cwd(), "src/lib/admin-content/trusted-canonical-ingest.ts"), "utf8");
  const localized = readFileSync(path.join(process.cwd(), "src/lib/admin-content/trusted-localized-ingest.ts"), "utf8");
  assert.match(canonical, /validateCompleteCurriculumPackage/);
  assert.match(localized, /validateCompleteCurriculumPackage/);
});
