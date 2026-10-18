import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

function configuredBuildSha(commitRef, githubSha) {
  const env = { ...process.env };
  if (commitRef === undefined) delete env.COMMIT_REF;
  else env.COMMIT_REF = commitRef;
  if (githubSha === undefined) delete env.GITHUB_SHA;
  else env.GITHUB_SHA = githubSha;
  const script = "import config from './next.config.mjs'; process.stdout.write(config.env.EDUNANCIAL_BUILD_COMMIT_SHA);";
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", script], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    timeout: 15000,
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

test("build provenance embeds the deployed Netlify commit SHA", () => {
  const netlify = "118533057aa1ecfbfdd6a0a2ff25f4ce532ff2b9";
  assert.equal(configuredBuildSha(netlify, "0".repeat(40)), netlify);
});

test("build provenance falls back to GitHub SHA when Netlify commit is absent", () => {
  const github = "f".repeat(40);
  assert.equal(configuredBuildSha(undefined, github), github);
});

test("build provenance does not invent a commit without evidence", () => {
  assert.equal(configuredBuildSha(undefined, undefined), "");
});
