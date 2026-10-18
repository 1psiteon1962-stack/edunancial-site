import { NextRequest, NextResponse } from "next/server";

import { readDurableExportPage } from "@/lib/admin-content/durable-curriculum-export";
import { GITHUB_RUNNER_WORKFLOWS, authorizeGithubActionsRun } from "@/lib/admin-content/github-actions-runner-auth";
import { getAdminContentStorage } from "@/lib/admin-content/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "private, no-store, max-age=0" } as const;

/**
 * Q2 — READ-ONLY durable curriculum export for the encrypted nightly archive.
 *
 *   GET /api/admin/curriculum/durable-export?cursor=0[&content=0]
 *
 * Only the signed GitHub OIDC identity of .github/workflows/curriculum-archive.yml
 * on main may call it. Nothing is written, moved or deleted.
 */
export async function GET(request: NextRequest) {
  let authorized = false;
  try {
    authorized = await authorizeGithubActionsRun(request, ["schedule", "workflow_dispatch"], GITHUB_RUNNER_WORKFLOWS.curriculumArchive);
  } catch {
    authorized = false;
  }
  if (!authorized) return NextResponse.json({ error: "Unauthorized curriculum archive runner." }, { status: 401, headers: NO_STORE });

  const params = request.nextUrl.searchParams;
  const rawCursor = params.get("cursor") ?? "0";
  if (!/^\d{1,7}$/u.test(rawCursor)) return NextResponse.json({ error: "cursor must be a non-negative integer." }, { status: 400, headers: NO_STORE });
  const content = params.get("content");
  if (content !== null && content !== "0" && content !== "1") return NextResponse.json({ error: "content must be 0 or 1." }, { status: 400, headers: NO_STORE });

  const page = await readDurableExportPage(getAdminContentStorage(), { cursor: Number(rawCursor), includeContent: content !== "0" });
  return NextResponse.json(page, { headers: NO_STORE });
}
