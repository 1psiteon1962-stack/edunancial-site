import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      commit: process.env.COMMIT_REF ?? process.env.GITHUB_SHA ?? "unknown",
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
