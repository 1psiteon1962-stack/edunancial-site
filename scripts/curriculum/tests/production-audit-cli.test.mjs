import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { AuditArgsError, parseAuditArgs } from "../production-audit-args.mjs";

const SCRIPT = "scripts/curriculum/production-audit.mjs";
const run = (args) => spawnSync(process.execPath, [SCRIPT, ...args], {
  encoding: "utf8",
  timeout: 20_000,
  // Point at a closed local port: any network attempt fails fast, never production.
  env: { PATH: process.env.PATH, EDUNANCIAL_BASE_URL: "http://127.0.0.1:9" },
});

test("defaults: all tracks, all levels, catalog-derived locales", () => {
  const options = parseAuditArgs([], {});
  assert.equal(options.base, "https://edunancial.com");
  assert.equal(options.tracks.length, 8);
  assert.deepEqual(options.levels, [1, 2, 3, 4, 5]);
  assert.equal(options.locales, null);
  assert.equal(options.concurrency, 1);
  assert.equal(options.updateBaseline, false);
});

test("accepts a valid targeted selection", () => {
  const options = parseAuditArgs(["--tracks", "RED,BLACK", "--levels", "1,3", "--locales", "en-US,es-Caribbean,fr-CA", "--concurrency", "2", "--update-baseline"], {});
  assert.deepEqual(options.tracks, ["RED", "BLACK"]);
  assert.deepEqual(options.levels, [1, 3]);
  assert.deepEqual(options.locales, ["en-US", "es-Caribbean", "fr-CA"]);
  assert.equal(options.concurrency, 2);
  assert.equal(options.updateBaseline, true);
});

const invalid = [
  [["--levels"], "missing value must not widen to all levels"],
  [["--levels", "--update-baseline"], "flag is not a value"],
  [["--levels=1"], "--name=value form is unsupported"],
  [["--levels", "1", "--levels", "2"], "duplicate flag"],
  [["--levels", "1,1"], "duplicate list item"],
  [["--levels", "1,,2"], "empty list item"],
  [["--levels", "0"], "out of range"],
  [["--levels", "6"], "out of range"],
  [["--levels", "1.0"], "non-integer"],
  [["--levels", "1;touch /tmp/x"], "shell metacharacters"],
  [["--levels", "$(id)"], "command substitution"],
  [["--levels", "1 2"], "space-separated"],
  [["--tracks", "red"], "lowercase track"],
  [["--tracks", "PINK"], "unknown track"],
  [["--locales", "en_US"], "bad locale"],
  [["--concurrency", "4"], "concurrency too high"],
  [["--concurrency", "1.5"], "fractional concurrency"],
  [["--base", "http://evil.example"], "plain http to remote host"],
  [["--base", "https://user:pw@edunancial.com"], "credentials in base"],
  [["--update-baseline", "--update-baseline"], "duplicate boolean"],
  [["--updatebaseline"], "unknown flag"],
  [["levels"], "stray positional argument"],
];

for (const [args, why] of invalid) {
  test(`parser rejects ${JSON.stringify(args)} (${why})`, () => {
    assert.throws(() => parseAuditArgs(args, {}), AuditArgsError);
  });
}

test("CLI exits 2 with a clear message before any network call on malformed input", () => {
  for (const args of [["--levels"], ["--levels=1"], ["--levels", "1;id"], ["--bogus"], ["--tracks", "RED", "--tracks", "RED"]]) {
    const result = run(args);
    assert.equal(result.status, 2, `${JSON.stringify(args)} stderr=${result.stderr}`);
    assert.match(result.stderr, /Invalid (arguments|audit selection):/);
    assert.match(result.stderr, /Usage:/);
    assert.doesNotMatch(result.stderr, /ECONNREFUSED|fetch failed/, "no network attempt was made");
  }
});

test("CLI with a valid selection proceeds to auditing (fails as FAIL=1, not argument error=2)", () => {
  const out = mkdtempSync(join(tmpdir(), "audit-cli-"));
  const result = run(["--tracks", "RED", "--levels", "1", "--locales", "en-US", "--out", out]);
  assert.equal(result.status, 1, result.stderr);
  assert.doesNotMatch(result.stderr, /Invalid (arguments|audit selection|--concurrency):/);
});
