import { NextResponse } from "next/server";

import { getOperationsDashboardData } from "@/lib/operations";

export async function GET() {
  const dashboard = getOperationsDashboardData();
  const ready = dashboard.services.every((service) => service.status !== "critical");

  return NextResponse.json(
    {
      ready,
      status: ready ? "ready" : "degraded",
      failoverReadiness: dashboard.failoverReadiness,
      summary: dashboard.summary,
    },
    { status: ready ? 200 : 503 },
  );
}
