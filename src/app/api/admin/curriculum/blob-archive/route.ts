import { NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin-content/auth";
import { verifyGithubOidcToken } from "@/lib/admin-content/github-oidc";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import {
  BLOB_ARCHIVE_AUDIENCE, BLOB_ARCHIVE_WORKFLOW,
  listArchiveKeys, readArchiveChunk,
} from "@/lib/curriculum/blob-archive-read";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * READ-ONLY endpoint for off-site encrypted curriculum backups.
 * No write or delete operations are accessible through this route.
 * GitHub OIDC caller must be this repo's scheduled/manual archive workflow on main.
 */
async function authorized(request: NextRequest): Promise<boolean> {
  try {
    const session = await getAdminSession();
    if (session && (session.role === "owner" || session.role === "admin")) return true;
  } catch { /* A valid GitHub OIDC request need not carry admin cookies. */ }

  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const owner = process.env.EDUNANCIAL_GITHUB_OWNER?.trim();
  const repo = process.env.EDUNANCIAL_GITHUB_REPO?.trim();
  if (!token || !owner || !repo) return false;
  return Boolean(await verifyGithubOidcToken(token, {
    audience: BLOB_ARCHIVE_AUDIENCE,
    repository: owner + "/" + repo,
    ref: "refs/heads/main",
    workflowPath: BLOB_ARCHIVE_WORKFLOW,
    allowedEvents: ["schedule", "workflow_dispatch"],
  }));
}

export async function GET(request: NextRequest) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "cache-control": "no-store" } });
  }
  const params = request.nextUrl.searchParams;
  try {
    const storage = getAdminContentStorage();
    if (params.get("op") === "list") {
      return NextResponse.json(await listArchiveKeys(storage), { headers: { "cache-control": "no-store" } });
    }
    if (params.get("op") === "object") {
      const offset = Number(params.get("offset") ?? "0");
      const chunk = await readArchiveChunk(storage, params.get("key") ?? "", offset);
      return NextResponse.json(chunk, { headers: { "cache-control": "no-store" } });
    }
    return NextResponse.json({ error: "Unknown op. Use op=list or op=object." },
      { status: 400, headers: { "cache-control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "ARCHIVE_READ_FAILED", detail: message },
      { status: 500, headers: { "cache-control": "no-store" } });
  }
}
