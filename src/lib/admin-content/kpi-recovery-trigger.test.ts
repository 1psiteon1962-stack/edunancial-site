import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { GITHUB_RUNNER_WORKFLOWS } from "@/lib/admin-content/github-actions-runner-auth";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

test("Q1 KPI recovery: only the manual recovery workflow identity may call the endpoint", () => {
  const route = read("src/app/api/admin/kpi/spool-recovery/route.ts");
  assert.equal(GITHUB_RUNNER_WORKFLOWS.kpiSpoolRecovery, ".github/workflows/kpi-spool-recovery.yml");
  assert.match(route, /authorizeGithubActionsRun\(request, \["workflow_dispatch"\], GITHUB_RUNNER_WORKFLOWS\.kpiSpoolRecovery\)/u);
  assert.doesNotMatch(route, /getAdminSession/u, "no browser-session path");
  assert.equal((route.match(/if \(!\(await authorized\(request\)\)\) return NextResponse\.json\(\{ error: "Unauthorized KPI recovery runner\." \}, \{ status: 401/gu) ?? []).length, 2, "GET and POST both require the robot identity first");
});

test("Q1 KPI recovery: replay stays behind both production switches and is bounded", () => {
  const route = read("src/app/api/admin/kpi/spool-recovery/route.ts");
  assert.match(route, /recoverKpiSpool\(normalizeReplayBatchSize\(rawLimit\)\)/u);
  assert.match(route, /status: 409/u, "switched-off replay is refused, not attempted");
  const recovery = read("src/lib/kpi/recovery.ts");
  assert.match(recovery, /export async function recoverKpiSpool[\s\S]{0,120}requireKpiReplayAuthorization\(process\.env\)/u);
  const status = recovery.slice(recovery.indexOf("export async function countPendingKpiSpool"));
  assert.doesNotMatch(status, /\.delete\(|\.set\(|writeReplayedKpiEvent/u, "status is read-only");
});

test("Q1 KPI recovery: the workflow is manual-only and treats inputs as data", () => {
  const workflow = read(".github/workflows/kpi-spool-recovery.yml");
  assert.doesNotMatch(workflow, /^\s*schedule:/mu, "no automatic replay");
  assert.doesNotMatch(workflow, /^\s*push:/mu);
  assert.doesNotMatch(workflow, /run: \|[\s\S]*\$\{\{\s*inputs\./u, "inputs reach the shell only through env");
  assert.match(workflow, /\^\[0-9\]\{1,3\}\$/u, "limit is validated before use");
});
