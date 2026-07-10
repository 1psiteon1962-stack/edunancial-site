import { NextResponse } from "next/server";
import { success } from "@/lib/api/response";
import { getEndpointStats } from "@/lib/monitoring/analytics";

export const runtime = "edge";

export async function GET() {
  const stats = getEndpointStats();
  const endpointCount = Object.keys(stats).length;
  const totalRequests = Object.values(stats).reduce((s, e) => s + e.requests, 0);
  const errorCount = Object.values(stats).reduce((s, e) => s + e.errors, 0);

  return success({
    status: "ok",
    version: "1",
    timestamp: new Date().toISOString(),
    endpoints: endpointCount,
    metrics: {
      totalRequests,
      errorCount,
      errorRate: totalRequests > 0 ? errorCount / totalRequests : 0,
    },
  });
}
