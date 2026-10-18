import assert from "node:assert/strict";
import test from "node:test";

import { resolveDeployCommit } from "./build-commit";

const A = "118533057aa1ecfbfdd6a0a2ff25f4ce532ff2b9";
const B = "f".repeat(40);

test("embedded build SHA is the deployed identity", () => {
  assert.equal(resolveDeployCommit({ embedded: A, runtime: undefined }), A);
});

test("embedded build SHA wins over any runtime value", () => {
  assert.equal(resolveDeployCommit({ embedded: A, runtime: B }), A);
});

test("falls back to runtime COMMIT_REF when nothing was embedded", () => {
  assert.equal(resolveDeployCommit({ embedded: "", runtime: B }), B);
});

test("missing or malformed evidence yields null, never a guessed SHA", () => {
  assert.equal(resolveDeployCommit({ embedded: "", runtime: undefined }), null);
  assert.equal(resolveDeployCommit({}), null);
  for (const bad of ["unknown", "HEAD", "1185330", `${A}0`, "z".repeat(40), " "]) {
    assert.equal(resolveDeployCommit({ embedded: bad, runtime: bad }), null, bad);
  }
});

test("normalizes case and whitespace", () => {
  assert.equal(resolveDeployCommit({ embedded: ` ${A.toUpperCase()} ` }), A);
});

test("source keeps the literal process.env references Next.js must inline at build time", async () => {
  const { readFileSync } = await import("node:fs");
  const source = readFileSync("src/lib/deployment/build-commit.ts", "utf8");
  assert.match(source, /embedded: process\.env\.EDUNANCIAL_BUILD_COMMIT_SHA,/);
  assert.match(source, /runtime: process\.env\.COMMIT_REF,/);
  const config = readFileSync("next.config.mjs", "utf8");
  assert.match(config, /EDUNANCIAL_BUILD_COMMIT_SHA: process\.env\.COMMIT_REF \|\| process\.env\.GITHUB_SHA \|\| ""/);
});
