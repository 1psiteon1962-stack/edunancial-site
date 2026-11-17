import assert from "node:assert/strict";
import { test } from "node:test";

import { catalogSnapshotKey } from "./catalog-snapshot-key";

test("production keeps the existing snapshot key", () => {
  assert.equal(catalogSnapshotKey("en-US", { CONTEXT: "production" }), "published/catalog-snapshots/v1/en-US.json");
});

test("previews and branch deploys never touch production snapshots", () => {
  for (const CONTEXT of ["deploy-preview", "branch-deploy", "dev", undefined]) {
    const key = catalogSnapshotKey("en-US", { CONTEXT, DEPLOY_ID: "abc123" });
    assert.equal(key, "preview/abc123/catalog-snapshots/v1/en-US.json");
    assert.ok(!key.startsWith("published/"));
  }
  assert.equal(catalogSnapshotKey("fr-FR", { CONTEXT: "deploy-preview" }), "preview/unknown/catalog-snapshots/v1/fr-FR.json");
});
