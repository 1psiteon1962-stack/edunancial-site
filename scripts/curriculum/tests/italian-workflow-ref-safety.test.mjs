import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const WORKFLOW = ".github/workflows/complete-italian-l1.yml";
const UNTRUSTED = /\$\{\{\s*(inputs\.|github\.event\.|github\.head_ref|github\.ref_name)/;

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

test("translation workflow never places event data or ref names in shell source", () => {
  for (const block of runBlocks(WORKFLOW)) assert.doesNotMatch(block.body, UNTRUSTED, `${WORKFLOW}:${block.line}`);
});

function commitStep(refName, refType = "branch") {
  const block = runBlocks(WORKFLOW).find((b) => b.body.includes("TARGET_REF_NAME"));
  assert.ok(block, "commit step not found");
  // Replace git side effects with probes; keep the real validation logic.
  const probe = block.body
    .replace(/^git (config|add|diff).*$/gm, "true")
    .replace(/^git push origin "HEAD:refs\/heads\/\$TARGET_REF_NAME"$/m, `printf 'PUSH<%s>\\n' "HEAD:refs/heads/$TARGET_REF_NAME"`);
  assert.match(probe, /PUSH</, "push line changed; update this test deliberately");
  const dir = mkdtempSync(join(tmpdir(), "it-ref-"));
  const result = spawnSync("bash", ["-c", probe], { cwd: dir, encoding: "utf8", env: { PATH: process.env.PATH, TARGET_REF_NAME: refName, TARGET_REF_TYPE: refType } });
  return { ...result, dir };
}

test("valid branch is pushed as one exact, quoted refspec", () => {
  assert.equal(commitStep("main").stdout, "PUSH<HEAD:refs/heads/main>\n");
  assert.equal(commitStep("feature/nl-l1").stdout, "PUSH<HEAD:refs/heads/feature/nl-l1>\n");
});

test("tags and malformed or hostile ref names are refused and never executed", () => {
  assert.equal(commitStep("v1.0", "tag").status, 1);
  for (const evil of ["$(touch pwned)", "`touch pwned`", "a b", "x..y", "-f", "bad~ref", "a:b", "refs/heads/../x", "a\ntouch pwned"]) {
    const result = commitStep(evil);
    assert.equal(result.status, 1, `${JSON.stringify(evil)} -> ${result.stdout}${result.stderr}`);
    assert.equal(result.stdout.includes("PUSH<"), false);
    assert.equal(existsSync(join(result.dir, "pwned")), false, `executed: ${JSON.stringify(evil)}`);
  }
});

test("shell metacharacters that git allows in names stay inert data", () => {
  const result = commitStep("a;touch_pwned");
  assert.equal(existsSync(join(result.dir, "touch_pwned")), false);
  if (result.status === 0) assert.equal(result.stdout, "PUSH<HEAD:refs/heads/a;touch_pwned>\n");
});
