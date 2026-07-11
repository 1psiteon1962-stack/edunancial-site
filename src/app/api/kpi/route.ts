// src/app/api/kpi/route.ts

import { NextResponse } from "next/server";

import { writeAuditLog, writeSecurityEvent } from "@/lib/security/audit";
import { validateCsrfRequest, getCookieValue } from "@/lib/security/csrf";
import { CONSENT_COOKIE_NAME, parseConsentPreferences } from "@/lib/security/privacy";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { getSecuritySessionFromRequest } from "@/lib/security/session";
import { writeMonitoringEvent } from "@/lib/security/monitoring";
import { isRecord, readJsonBody, validateString } from "@/lib/security/validation";

type KPIRequestBody = {
  event_name?: string;
  event_type?: string | null;
  metadata?: Record<string, unknown>;
};

function createFingerprint(request: Request): string {
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "unknown";

  return `${userAgent}:${forwardedFor}`;
}

async function writeKPIEvent(event: {
  event_name: string;
  event_type?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  writeMonitoringEvent({
    category: "analytics.event.normalized",
    metadata: {
      event_name: event.event_name,
      event_type: event.event_type ?? "unknown",
      metadata: event.metadata ?? {},
      receivedAt: new Date().toISOString(),
    },
  });
}

export async function POST(request: Request) {
  try {
    const csrf = validateCsrfRequest(request);

    if (!csrf.ok) {
      writeSecurityEvent({
        event: "csrf.kpi.blocked",
        severity: "warning",
        request,
        metadata: { reason: csrf.reason },
      });

      return NextResponse.json({ success: false, error: "Invalid request." }, { status: 403 });
    }

    const session = await getSecuritySessionFromRequest(request);
    const rateLimit = applyRateLimit({
      request,
      name: "kpi.raw",
      limit: Number(process.env.EDUNANCIAL_RATE_LIMIT_KPI ?? 60),
      windowMs: 10 * 60 * 1000,
      sessionKey: session.userId,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
    }

    const consent = parseConsentPreferences(
      getCookieValue(request.headers.get("cookie"), CONSENT_COOKIE_NAME)
    );

    if (!consent.analytics) {
      return NextResponse.json({ success: false, skipped: "consent_required" }, { status: 202 });
    }

    const rawBody = await readJsonBody(request);
    const body = rawBody as KPIRequestBody | null;
    const eventName = validateString(body?.event_name, {
      field: "event_name",
      maxLength: 80,
      minLength: 2,
    });
    const eventType = body?.event_type
      ? validateString(body.event_type, {
          field: "event_type",
          maxLength: 80,
          minLength: 2,
        })
      : null;

    if (!body || !eventName || (body.event_type && !eventType)) {
      return NextResponse.json(
        { success: false, error: "Invalid event payload" },
        { status: 400 }
      );
    }

    const fingerprint = createFingerprint(request);

    await writeKPIEvent({
      event_name: eventName,
      event_type: eventType ?? undefined,
      metadata: {
        ...(isRecord(body.metadata) ? body.metadata : {}),
        fingerprint,
      },
    });

    writeAuditLog({
      action: "analytics.kpi_recorded",
      actorId: session.userId,
      actorRole: session.role,
      target: eventName,
      outcome: "success",
      request,
      metadata: {
        event_type: eventType,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    writeSecurityEvent({
      event: "kpi.failed",
      severity: "error",
      request,
      metadata: {
        error: error instanceof Error ? error.message : "unknown",
      },
    });

    return NextResponse.json(
      { success: false, error: "KPI route failed" },
      { status: 500 }
    );
  }
}
