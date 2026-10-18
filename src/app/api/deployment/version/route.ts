import { NextResponse } from "next/server";

import { resolveDeployCommit } from "@/lib/deployment/build-commit";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      commit: resolveDeployCommit() ?? "unknown",
      context: process.env.CONTEXT ?? process.env.NODE_ENV ?? "unknown",
      deployId: process.env.DEPLOY_ID ?? null,
      site: process.env.SITE_NAME ?? null,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
