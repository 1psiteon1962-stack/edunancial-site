import { NextRequest, NextResponse } from "next/server";

import { GITHUB_RUNNER_WORKFLOWS, authorizeGithubActionsRun } from "@/lib/admin-content/github-actions-runner-auth";
import { countPendingKpiSpool, recoverKpiSpool } from "@/lib/kpi/recovery";
import { normalizeReplayBatchSize } from "@/lib/kpi/replay-guardrails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "private, no-store, max-age=0" } as const;

/**
 * Q1 — protected KPI spool recovery trigger.
 *
 *   GET  /api/admin/kpi/spool-recovery            read-only pending count
 *   POST /api/admin/kpi/spool-recovery?limit=25   one bounded recovery batch
 *
 * Only the signed GitHub OIDC identity of .github/workflows/kpi-spool-recovery.yml
 * (manual dispatch on main) may call it. Recovery additionally requires
 * KPI_SPOOL_REPLAY_ENABLED=true and KPI_REPLAY_MIGRATION_APPLIED=true; otherwise
 * it refuses with HTTP 409 and touches nothing.
 */
async function authorized(request: NextRequest): Promise<boolean> {
  try {
    return await authorizeGithubActionsRun(request, ["workflow_dispatch"], GITHUB_RUNNER_WORKFLOWS.kpiSpoolRecovery);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!(await authorized(request))) return NextResponse.json({ error: "Unauthorized KPI recovery runner." }, { status: 401, headers: NO_STORE });
  const status = await countPendingKpiSpool();
  return NextResponse.json({ ...status, replayEnabled: process.env.KPI_SPOOL_REPLAY_ENABLED === "true", migrationConfirmed: process.env.KPI_REPLAY_MIGRATION_APPLIED === "true" }, { headers: NO_STORE });
}

export async function POST(request: NextRequest) {
  if (!(await authorized(request))) return NextResponse.json({ error: "Unauthorized KPI recovery runner." }, { status: 401, headers: NO_STORE });
  const rawLimit = request.nextUrl.searchParams.get("limit") ?? "25";
  if (!/^\d{1,3}$/u.test(rawLimit)) return NextResponse.json({ error: "limit must be an integer from 1 to 100." }, { status: 400, headers: NO_STORE });
  try {
    const report = await recoverKpiSpool(normalizeReplayBatchSize(rawLimit));
    return NextResponse.json(report, { headers: NO_STORE });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/disabled|not been confirmed/iu.test(message)) return NextResponse.json({ error: message, refused: true }, { status: 409, headers: NO_STORE });
    throw error;
  }
}
