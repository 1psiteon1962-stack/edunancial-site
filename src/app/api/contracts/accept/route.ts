import { NextResponse } from "next/server";
import { logStructuredError } from "@/lib/observability/errors";
import { logger } from "@/lib/observability/logger";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";
import { logAuditEvent } from "@/lib/auditLog";

export async function POST(req: Request) {
  const start = Date.now();
  const requestId = getRequestId(req.headers);

  try {
    const body = (await req.json()) as { contractId?: string; userId?: string };

    const contractId = body.contractId ?? "unknown";

    logAuditEvent({
      actor: body.userId ?? "anonymous",
      action: "contract.accept",
      target: "contract",
      result: "success",
      requestId,
      metadata: {
        contractId,
      },
    });

    const response = NextResponse.json({
      status: "accepted",
      contractId,
      requestId,
    });

    recordRequestMetric({
      method: req.method,
      route: "/api/contracts/accept",
      status: 200,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  } catch (error) {
    logStructuredError(error, {
      ...getRequestContext(req, requestId),
      route: "/api/contracts/accept",
    });

    logAuditEvent({
      actor: "anonymous",
      action: "contract.accept",
      target: "contract",
      result: "failure",
      requestId,
    });

    const response = NextResponse.json(
      { status: "error", error: "Invalid request payload", requestId },
      { status: 400 }
    );

    recordRequestMetric({
      method: req.method,
      route: "/api/contracts/accept",
      status: 400,
      durationMs: Date.now() - start,
    });

    logger.warn("contracts.accept.failed", {
      requestId,
      route: "/api/contracts/accept",
    });

    return attachRequestHeaders(response, requestId);
  }
}
