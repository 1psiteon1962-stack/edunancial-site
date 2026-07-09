import { NextResponse } from "next/server";

import { writeAuditLog, writeSecurityEvent } from "@/lib/security/audit";
import { validateCsrfRequest } from "@/lib/security/csrf";
import { getCookieValue } from "@/lib/security/csrf";
import { CONSENT_COOKIE_NAME, parseConsentPreferences } from "@/lib/security/privacy";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { getSecuritySessionFromRequest } from "@/lib/security/session";
import { writeMonitoringEvent } from "@/lib/security/monitoring";
import { isRecord, readJsonBody, validateNumber, validateString } from "@/lib/security/validation";

export async function POST(request: Request) {
  try {
    const csrf = validateCsrfRequest(request);

    if (!csrf.ok) {
      writeSecurityEvent({
        event: "csrf.kpi_track.blocked",
        severity: "warning",
        request,
        metadata: { reason: csrf.reason },
      });

      return NextResponse.json({ success: false, error: "Invalid request." }, { status: 403 });
    }

    const session = await getSecuritySessionFromRequest(request);
    const rateLimit = applyRateLimit({
      request,
      name: "kpi.track",
      limit: Number(process.env.EDUNANCIAL_RATE_LIMIT_KPI ?? 60),
      windowMs: 10 * 60 * 1000,
      sessionKey: session.userId,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many analytics events." },
        { status: 429 }
      );
    }

    const consent = parseConsentPreferences(
      getCookieValue(request.headers.get("cookie"), CONSENT_COOKIE_NAME)
    );

    if (!consent.analytics) {
      return NextResponse.json({ success: false, skipped: "consent_required" }, { status: 202 });
    }

    const body = await readJsonBody(request);
    const eventName = validateString(body?.event_name ?? body?.event, {
      field: "event_name",
      maxLength: 80,
      minLength: 2,
    });
    const label = validateString(body?.label, {
      field: "label",
      maxLength: 120,
    });
    const value =
      body?.value === undefined
        ? null
        : validateNumber(body.value, { max: 1_000_000, min: 0 });
    const metadata = isRecord(body?.metadata) ? body.metadata : {};

    if (!body || !eventName || (body?.value !== undefined && value === null)) {
      return NextResponse.json(
        { success: false, error: "Invalid KPI payload" },
        { status: 400 }
      );
    }

    writeMonitoringEvent({
      category: "analytics.event.received",
      metadata: {
        eventName,
        hasLabel: Boolean(label),
      },
    });

    writeAuditLog({
      action: "analytics.kpi_tracked",
      actorId: session.userId,
      actorRole: session.role,
      target: eventName,
      outcome: "success",
      request,
      metadata: {
        label,
        metadata,
        value,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    writeSecurityEvent({
      event: "kpi_track.failed",
      severity: "error",
      request,
      metadata: {
        error: error instanceof Error ? error.message : "unknown",
      },
    });

    return NextResponse.json(
      { success: false, error: "KPI tracking failed" },
      { status: 500 }
    );
  }
}
