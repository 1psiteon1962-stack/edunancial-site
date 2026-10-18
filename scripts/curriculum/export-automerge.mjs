#!/usr/bin/env node
// Q4 — zero-touch Git sync. Merges curriculum upload-export pull requests only
// after every CI check and the production Netlify preview have passed.
//
// A pull request is merged only when ALL of the following hold:
//   - it carries the `curriculum-export` label (added by the uploader's exporter)
//   - its head branch is `content/course-upload-*` in this repository
//     (admin edit/delete PRs use other branch names and are never merged here)
//   - every changed file is under an allowed curriculum path and none is removed
//   - every check run on the head commit has completed as success/neutral/skipped,
//     and the required gates are present
//   - the production Netlify deploy-preview status is success
//   - GitHub reports the pull request as cleanly mergeable
// The merge is pinned to the evaluated head SHA, so a later push is never merged
// unevaluated. This is CI-gated merging, not a CI bypass.

export const EXPORT_LABEL = "curriculum-export";
export const EXPORT_BRANCH_PREFIX = "content/course-upload-";
export const ALLOWED_PATH_PREFIXES = ["content/curriculum/", "content/courses/", "curriculum/", "exports/"];
export const REQUIRED_CHECKS = ["Curriculum Preservation Gate", "curriculum-integrity", "Build", "validate"];
export const REQUIRED_STATUS = "netlify/edunancial/deploy-preview";
const PASSING = new Set(["success", "neutral", "skipped"]);

export function evaluateExportPullRequest({ pr, files, checkRuns, statuses, repository }) {
  const reasons = [];
  const labels = (pr.labels ?? []).map((label) => label.name);
  if (pr.state !== "open") reasons.push(`state is ${pr.state}`);
  if (pr.draft) reasons.push("draft");
  if (!labels.includes(EXPORT_LABEL)) reasons.push(`missing ${EXPORT_LABEL} label`);
  if (!String(pr.head?.ref ?? "").startsWith(EXPORT_BRANCH_PREFIX)) reasons.push(`head branch is not ${EXPORT_BRANCH_PREFIX}*`);
  if (pr.head?.repo?.full_name !== repository) reasons.push("head branch is not in this repository");
  if (pr.base?.ref !== "main") reasons.push("base is not main");

  if (!files.length) reasons.push("no changed files");
  for (const file of files) {
    if (file.status === "removed") reasons.push(`removes ${file.filename}`);
    if (file.previous_filename && file.status === "renamed") reasons.push(`renames ${file.previous_filename}`);
    if (!ALLOWED_PATH_PREFIXES.some((prefix) => file.filename.startsWith(prefix))) reasons.push(`touches non-curriculum path ${file.filename}`);
  }

  if (!checkRuns.length) reasons.push("no check runs yet");
  for (const run of checkRuns) {
    if (run.status !== "completed") reasons.push(`check ${run.name} is ${run.status}`);
    else if (!PASSING.has(run.conclusion)) reasons.push(`check ${run.name} concluded ${run.conclusion}`);
  }
  for (const name of REQUIRED_CHECKS) {
    if (!checkRuns.some((run) => run.name === name && run.status === "completed" && run.conclusion === "success")) reasons.push(`required check ${name} has not passed`);
  }
  // The combined-status API lists the newest state per context first.
  const netlify = statuses.find((status) => status.context === REQUIRED_STATUS);
  if (!netlify || netlify.state !== "success") reasons.push(`${REQUIRED_STATUS} is ${netlify?.state ?? "missing"}`);

  if (pr.mergeable !== true || pr.mergeable_state !== "clean") reasons.push(`not cleanly mergeable (${pr.mergeable_state ?? "unknown"})`);
  return { eligible: reasons.length === 0, reasons: [...new Set(reasons)] };
}

async function github(path, init = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!response.ok) throw new Error(`GitHub ${init.method ?? "GET"} ${path} failed (${response.status}): ${(await response.text()).slice(0, 300)}`);
  return response.status === 204 ? null : response.json();
}

async function main() {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository || !process.env.GITHUB_TOKEN) throw new Error("GITHUB_REPOSITORY and GITHUB_TOKEN are required.");
  const dryRun = process.env.DRY_RUN === "true";
  const base = `/repos/${repository}`;
  const candidates = await github(`${base}/issues?state=open&labels=${encodeURIComponent(EXPORT_LABEL)}&per_page=50`);
  let merged = 0;
  for (const issue of candidates.filter((entry) => entry.pull_request)) {
    const pr = await github(`${base}/pulls/${issue.number}`);
    const sha = pr.head.sha;
    const files = await github(`${base}/pulls/${issue.number}/files?per_page=100`);
    if (files.length >= 100) {
      // Large exports: page through every file so the path check sees all of them.
      for (let page = 2; ; page += 1) {
        const more = await github(`${base}/pulls/${issue.number}/files?per_page=100&page=${page}`);
        files.push(...more);
        if (more.length < 100) break;
      }
    }
    const { check_runs: checkRuns } = await github(`${base}/commits/${sha}/check-runs?per_page=100`);
    const { statuses } = await github(`${base}/commits/${sha}/status`);
    const verdict = evaluateExportPullRequest({ pr, files, checkRuns, statuses, repository });
    if (!verdict.eligible) {
      console.log(`#${pr.number} waiting: ${verdict.reasons.join("; ")}`);
      continue;
    }
    if (dryRun) {
      console.log(`#${pr.number} eligible (dry run, not merged)`);
      continue;
    }
    const result = await github(`${base}/pulls/${pr.number}/merge`, {
      method: "PUT",
      body: JSON.stringify({ merge_method: "merge", sha, commit_title: `Merge curriculum export #${pr.number}: ${pr.title}` }),
    });
    merged += 1;
    console.log(`#${pr.number} merged as ${result.sha}`);
  }
  console.log(`curriculum export auto-merge: ${merged} merged`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => { console.error(error); process.exit(1); });
}
