import { NextResponse } from "next/server";

import { getOperationsDashboardData } from "@/lib/operations";

export async function GET() {
  const dashboard = getOperationsDashboardData();
  const criticalService = dashboard.services.find((service) => service.status === "critical");
  const failingBackup = dashboard.backups.find((backup) => backup.status === "failed");

  const status = criticalService || failingBackup ? "warning" : "healthy";

  return NextResponse.json({
    ok: true,
    status,
    uptimeSeconds: Math.floor(process.uptime()),
    summary: dashboard.summary,
    services: dashboard.services,
    backups: dashboard.backups.map((backup) => ({
      resource: backup.resource,
      status: backup.status,
      verification: backup.verification.status,
      restoreTest: backup.restoreTest.status,
    })),
    endpoints: {
      readiness: "/api/health/readiness",
      liveness: "/api/health/liveness",
      dashboard: "/api/operations/dashboard",
      logs: "/api/operations/logs",
    },
  });
}
