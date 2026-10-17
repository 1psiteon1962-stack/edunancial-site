import { NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin-content/auth";
import { authorizeGithubActionsRun } from "@/lib/admin-content/github-actions-runner-auth";
import { auditLocales, formatAuditLine, runProductionAudit } from "@/lib/curriculum/production-audit";
import { MAX_PRODUCTION_AUDIT_COORDINATES, parseProductionAuditSelection } from "@/lib/curriculum/production-audit-request-selection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * READ-ONLY production curriculum audit through the learner resolver.
 *
 *   GET /api/admin/curriculum/production-audit?tracks=RED,WHITE&levels=1&locales=en-US,fr-CA
 *   &format=text   one line per coordinate
 *   (default)      full JSON with per-lesson layer diagnostics
 *
 * Keep each request small (one level × a few locales); scripts/curriculum/
 * production-audit.mjs walks every coordinate and assembles the matrix.
 */
async function authorized(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (session && (session.role === "admin" || session.role === "owner")) return true;
  } catch { /* fall through to machine auth */ }
  try {
    return await authorizeGithubActionsRun(request, ["workflow_dispatch", "schedule", "push"]);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!(await authorized(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const params = request.nextUrl.searchParams;
  const selection = parseProductionAuditSelection(params, auditLocales());
  if (!selection) {
    return NextResponse.json(
      { error: "AUDIT_SELECTION_INVALID", detail: `Specify known tracks, levels (1-5) and supported locales without duplicates; maximum ${MAX_PRODUCTION_AUDIT_COORDINATES} coordinates per request.` },
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }
  const { tracks, levels, locales } = selection;
  try {
    const result = await runProductionAudit({ tracks, levels, locales });
    if (params.get("format") === "text") {
      const body = [
        `# Edunancial production curriculum audit ${result.meta.generatedAt} commit=${result.meta.deployCommit ?? "unknown"} source=${result.meta.curriculumSource}`,
        `# atomic: indexed=${result.meta.atomic?.indexedLessonIds ?? "n/a"} loaded=${result.meta.atomic?.loadedLessons ?? "n/a"} unreadable=${result.meta.atomic?.failedLessonIds.length ?? "n/a"} missingObjects=${result.meta.atomic?.missingObjects.length ?? "n/a"}`,
        ...result.coordinates.map(formatAuditLine),
      ].join("\n");
      return new NextResponse(`${body}\n`, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
    }
    return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    // An audit that cannot compute a number is itself a defect: report it loudly.
    return NextResponse.json({ error: "AUDIT_FAILED", detail: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
