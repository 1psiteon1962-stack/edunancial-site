import { NextResponse } from "next/server";
import { fetchEventsCSV } from "@/lib/kpi/adminQueries";
import { logAdminAuditEvent, logAuthAuditEvent } from "@/lib/auditLog";
import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import {
  attachRequestHeaders,
  getRequestContext,
  getRequestId,
} from "@/lib/observability/tracing";

export const runtime = "nodejs";

function getProvidedToken(request: Request): string | null {
  const bearer = request.headers.get("authorization");
  if (bearer?.startsWith("Bearer ")) {
    return bearer.slice("Bearer ".length).trim();
  }

  return request.headers.get("x-admin-metrics-token");
}

export async function GET(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);
  const configuredToken = process.env.ADMIN_METRICS_TOKEN;
  const providedToken = getProvidedToken(request);

  if (configuredToken && providedToken !== configuredToken) {
    logAuthAuditEvent({
      actor: "anonymous",
      action: "admin.metrics.authenticate",
      result: "failure",
      requestId,
      target: "admin.kpi.export",
    });

    const response = NextResponse.json(
      { error: "Unauthorized", requestId },
      { status: 401 }
    );

    recordRequestMetric({
      method: request.method,
      route: "/admin/kpi/export",
      status: 401,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  }

  logAuthAuditEvent({
    actor: "admin",
    action: "admin.metrics.authenticate",
    result: "success",
    requestId,
    target: "admin.kpi.export",
  });

  try {
    const csv = await fetchEventsCSV();

    logAdminAuditEvent({
      actor: "admin",
      action: "admin.kpi.export",
      result: "success",
      requestId,
      target: "kpi.events",
    });

    const response = new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=kpi-events.csv",
      },
    });

    recordRequestMetric({
      method: request.method,
      route: "/admin/kpi/export",
      status: 200,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  } catch (error) {
    logStructuredError(error, {
      ...getRequestContext(request, requestId),
      route: "/admin/kpi/export",
    });

    logAdminAuditEvent({
      actor: "admin",
      action: "admin.kpi.export",
      result: "failure",
      requestId,
      target: "kpi.events",
    });

    const response = NextResponse.json(
      { error: "Failed to export KPI data", requestId },
      { status: 500 }
    );

    recordRequestMetric({
      method: request.method,
      route: "/admin/kpi/export",
      status: 500,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  }
}
