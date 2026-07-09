import { NextRequest, NextResponse } from "next/server";

import { getOperationsDashboardData, LogQuery } from "@/lib/operations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filters: LogQuery = {
    query: searchParams.get("query") ?? undefined,
    severity: (searchParams.get("severity") as LogQuery["severity"]) ?? "all",
    eventType: (searchParams.get("eventType") as LogQuery["eventType"]) ?? "all",
  };

  const dashboard = getOperationsDashboardData(filters);

  return NextResponse.json({
    filters,
    count: dashboard.logs.length,
    logs: dashboard.logs,
    retention: dashboard.logRetention,
  });
}
