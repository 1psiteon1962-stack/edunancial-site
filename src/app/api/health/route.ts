import { NextResponse } from "next/server";

import { getReadinessSnapshot, writeMonitoringEvent } from "@/lib/security/monitoring";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const readiness = getReadinessSnapshot();

  writeMonitoringEvent({
    category: "health.read",
    metadata: {
      requestId: request.headers.get("x-request-id"),
    },
  });

  return NextResponse.json(
    {
      ok: readiness.env.ready,
      readiness,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
      status: readiness.env.ready ? 200 : 503,
    }
  );
}
