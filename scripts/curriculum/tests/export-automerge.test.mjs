import assert from "node:assert/strict";
import test from "node:test";

import { REQUIRED_CHECKS, evaluateExportPullRequest } from "../export-automerge.mjs";

const repository = "1psiteon1962-stack/edunancial-site";

function greenCase() {
  return {
    repository,
    pr: {
      number: 9001,
      state: "open",
      draft: false,
      labels: [{ name: "curriculum-export" }],
      head: { ref: "content/course-upload-batch_1-red-l1-it", repo: { full_name: repository }, sha: "abc" },
      base: { ref: "main" },
      mergeable: true,
      mergeable_state: "clean",
    },
    files: [
      { filename: "content/curriculum/RED/L1/RED-L1-001.it-IT.md", status: "added" },
      { filename: "curriculum/registry.json", status: "modified" },
      { filename: "curriculum/inventory.json", status: "modified" },
      { filename: "exports/batch_1/manifest.json", status: "added" },
    ],
    checkRuns: [
      ...REQUIRED_CHECKS.map((name) => ({ name, status: "completed", conclusion: "success" })),
      { name: "phase0-safety-net", status: "completed", conclusion: "success" },
      { name: "Pages changed - edunancial", status: "completed", conclusion: "neutral" },
    ],
    statuses: [{ context: "netlify/edunancial/deploy-preview", state: "success" }],
  };
}

test("Q4: a fully green upload export is eligible", () => {
  assert.deepEqual(evaluateExportPullRequest(greenCase()), { eligible: true, reasons: [] });
});

test("Q4: admin delete/edit PRs are never eligible even if labelled", () => {
  const c = greenCase();
  c.pr.head.ref = "content/admin-delete-red-l1-001-20261018000000";
  assert.equal(evaluateExportPullRequest(c).eligible, false);
});

test("Q4: unlabelled export PRs (including old uploads) are not eligible", () => {
  const c = greenCase();
  c.pr.labels = [];
  assert.equal(evaluateExportPullRequest(c).eligible, false);
});

test("Q4: a PR that removes any file is never auto-merged", () => {
  const c = greenCase();
  c.files.push({ filename: "content/curriculum/RED/L1/RED-L1-002.md", status: "removed" });
  const verdict = evaluateExportPullRequest(c);
  assert.equal(verdict.eligible, false);
  assert.ok(verdict.reasons.some((reason) => reason.startsWith("removes ")));
});

test("Q4: a PR touching code or workflows is never auto-merged", () => {
  for (const filename of ["src/lib/admin-content/github.ts", ".github/workflows/x.yml", "package.json"]) {
    const c = greenCase();
    c.files.push({ filename, status: "modified" });
    assert.equal(evaluateExportPullRequest(c).eligible, false, filename);
  }
});

test("Q4: pending, failed, or missing CI blocks the merge", () => {
  const pending = greenCase();
  pending.checkRuns[0] = { ...pending.checkRuns[0], status: "in_progress", conclusion: null };
  assert.equal(evaluateExportPullRequest(pending).eligible, false);

  const failed = greenCase();
  failed.checkRuns.push({ name: "Production Validation", status: "completed", conclusion: "failure" });
  assert.equal(evaluateExportPullRequest(failed).eligible, false);

  const missing = greenCase();
  missing.checkRuns = missing.checkRuns.filter((run) => run.name !== "Curriculum Preservation Gate");
  assert.equal(evaluateExportPullRequest(missing).eligible, false);

  const none = greenCase();
  none.checkRuns = [];
  assert.equal(evaluateExportPullRequest(none).eligible, false);
});

test("Q4: the production Netlify preview must be green", () => {
  for (const statuses of [[], [{ context: "netlify/edunancial/deploy-preview", state: "pending" }], [{ context: "netlify/edunancial-site/deploy-preview", state: "success" }]]) {
    const c = greenCase();
    c.statuses = statuses;
    assert.equal(evaluateExportPullRequest(c).eligible, false);
  }
});

test("Q4: drafts, forks, non-main bases and unclean merges are not eligible", () => {
  const draft = greenCase(); draft.pr.draft = true;
  const fork = greenCase(); fork.pr.head.repo.full_name = "someone/fork";
  const base = greenCase(); base.pr.base.ref = "release";
  const dirty = greenCase(); dirty.pr.mergeable_state = "behind";
  for (const c of [draft, fork, base, dirty]) assert.equal(evaluateExportPullRequest(c).eligible, false);
});
