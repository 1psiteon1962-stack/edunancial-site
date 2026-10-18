import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const AUDIT = ".github/workflows/production-curriculum-audit.yml";
const OIDC_CALLERS = [
  AUDIT,
  ".github/workflows/curriculum-github-export.yml",
  ".github/workflows/one-time-package-recovery.yml",
];
const UNTRUSTED = /\$\{\{\s*(inputs\.|github\.event\.(inputs|head_commit|pull_request|issue|comment)|github\.head_ref)/;

/** Return every `run: |` block body (dedented) in a workflow file. */
function runBlocks(file) {
  const lines = readFileSync(file, "utf8").split("\n");
  const blocks = [];
  for (let i = 0; i < lines.length; i += 1) {
    const match = /^(\s*)(?:- )?run: \|\s*$/.exec(lines[i]);
    if (!match) continue;
    const body = [];
    let indent = null;
    for (let j = i + 1; j < lines.length; j += 1) {
      const line = lines[j];
      if (line.trim() === "") { body.push(""); continue; }
      const lead = line.length - line.trimStart().length;
      if (lead <= match[1].length) break;
      indent ??= lead;
      body.push(line.slice(indent));
    }
    blocks.push({ line: i + 1, body: body.join("\n") });
  }
  return blocks;
}

test("audit and OIDC-caller workflows never interpolate untrusted input into shell source", () => {
  for (const file of OIDC_CALLERS) {
    for (const block of runBlocks(file)) {
      assert.doesNotMatch(block.body, UNTRUSTED, `${file}:${block.line}`);
    }
  }
});

test("machine-authorized workflows request OIDC and no longer send GITHUB_TOKEN as caller identity", () => {
  for (const file of OIDC_CALLERS) {
    const text = readFileSync(file, "utf8");
    assert.match(text, /id-token:\s*write/, `${file} needs id-token: write`);
    assert.match(text, /ACTIONS_ID_TOKEN_REQUEST_URL/, `${file} must request a fresh OIDC token`);
    assert.doesNotMatch(text, /Authorization: Bearer \$GH_TOKEN|Bearer \$GITHUB_TOKEN|X-GitHub-Repository/, `${file} still uses the legacy run-metadata auth`);
  }
});

function auditStepScript() {
  const block = runBlocks(AUDIT).find((b) => b.body.includes("LEVELS_INPUT"));
  assert.ok(block, "audit step with LEVELS_INPUT not found");
  // Replace the network call with a probe that prints each argument on its own line.
  const probe = block.body.replace(/node scripts\/curriculum\/production-audit\.mjs "\$\{args\[@\]\}"/, `for a in "\${args[@]}"; do printf 'ARG<%s>\\n' "$a"; done`);
  assert.notEqual(probe, block.body, "audit invocation line changed; update this test deliberately");
  return probe;
}

function runAuditStep(levels, updateBaseline = "false") {
  const dir = mkdtempSync(join(tmpdir(), "wf-input-"));
  const result = spawnSync("bash", ["-c", auditStepScript()], {
    cwd: dir, encoding: "utf8", env: { PATH: process.env.PATH, LEVELS_INPUT: levels, UPDATE_BASELINE_INPUT: updateBaseline },
  });
  return { ...result, dir };
}

test("valid dispatch inputs become exact, separately quoted arguments", () => {
  assert.equal(runAuditStep("").stdout, "", "blank levels = all levels, no --levels argument");
  assert.equal(runAuditStep("1").stdout, "ARG<--levels>\nARG<1>\n");
  assert.equal(runAuditStep("1,3,5", "true").stdout, "ARG<--levels>\nARG<1,3,5>\nARG<--update-baseline>\n");
});

test("malicious or malformed levels are rejected before the audit runs, and never executed", () => {
  for (const evil of ["1; touch pwned", "$(touch pwned)", "`touch pwned`", "1 --update-baseline", "1,", ",1", "6", "1,,2", "1\ntouch pwned", "1&&touch pwned"]) {
    const result = runAuditStep(evil);
    assert.equal(result.status, 2, `${JSON.stringify(evil)} -> ${result.stdout}${result.stderr}`);
    assert.equal(result.stdout.includes("ARG<"), false, `audit must not start for ${JSON.stringify(evil)}`);
    assert.equal(existsSync(join(result.dir, "pwned")), false, `input was executed: ${JSON.stringify(evil)}`);
  }
});

test("update_baseline only accepts the literal boolean true", () => {
  assert.equal(runAuditStep("1", "true; touch pwned").stdout, "ARG<--levels>\nARG<1>\n");
  assert.equal(runAuditStep("1", "TRUE").stdout, "ARG<--levels>\nARG<1>\n");
});
