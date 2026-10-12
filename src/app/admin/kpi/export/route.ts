import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-content/auth";
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

function tokensMatch(provided: string | null, configured: string): boolean {
  if (provided === null) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(configured);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);
  const configuredToken = process.env.ADMIN_METRICS_TOKEN;
  const providedToken = getProvidedToken(request);
  // A verified (signed) admin session is always required; never rely on middleware alone.
  // When ADMIN_METRICS_TOKEN is configured, the token is required in addition, as before.
  const session = await requireAdminApiSession(request);
  const tokenRejected = Boolean(configuredToken) && !tokensMatch(providedToken, configuredToken as string);

  if (!session.ok || tokenRejected) {
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
