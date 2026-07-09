import { NextResponse } from "next/server";

import { GlobalPermission } from "@/lib/globalPermissions";
import {
  writeDataBreachIncident,
  writeSecurityEvent,
} from "@/lib/security/audit";
import { validateCsrfRequest } from "@/lib/security/csrf";
import { applyRateLimit } from "@/lib/security/rate-limit";
import {
  getSecuritySessionFromRequest,
  hasSessionPermission,
} from "@/lib/security/session";
import { writeMonitoringEvent } from "@/lib/security/monitoring";
import { isRecord, readJsonBody, validateString } from "@/lib/security/validation";

const SEVERITIES = ["low", "medium", "high", "critical"] as const;
const STATUSES = ["investigating", "contained", "resolved"] as const;

export async function POST(request: Request) {
  const csrf = validateCsrfRequest(request);

  if (!csrf.ok) {
    writeSecurityEvent({
      event: "csrf.breach_report.blocked",
      severity: "warning",
      request,
      metadata: { reason: csrf.reason },
    });

    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }

  const session = await getSecuritySessionFromRequest(request);

  if (!hasSessionPermission(session, GlobalPermission.SYSTEM_ADMIN)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rateLimit = applyRateLimit({
    request,
    name: "admin.security.breach",
    limit: Number(process.env.EDUNANCIAL_RATE_LIMIT_BREACH ?? 10),
    windowMs: 10 * 60 * 1000,
    sessionKey: session.userId,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await readJsonBody(request);
  const title = validateString(body?.title, {
    field: "title",
    maxLength: 120,
    minLength: 4,
  });
  const summary = validateString(body?.summary, {
    field: "summary",
    maxLength: 1000,
    minLength: 10,
  });
  const severity = validateString(body?.severity, {
    field: "severity",
    allowedValues: SEVERITIES,
  }) as (typeof SEVERITIES)[number] | null;
  const status = validateString(body?.status, {
    field: "status",
    allowedValues: STATUSES,
  }) as (typeof STATUSES)[number] | null;
  const impactedSystems = Array.isArray(body?.impactedSystems)
    ? body.impactedSystems
        .map((entry) =>
          validateString(entry, {
            field: "impactedSystems",
            maxLength: 80,
            minLength: 2,
          })
        )
        .filter((entry): entry is string => Boolean(entry))
        .slice(0, 20)
    : [];

  if (!body || !title || !summary || !severity || !status || (body?.metadata && !isRecord(body.metadata))) {
    return NextResponse.json({ error: "Invalid breach payload." }, { status: 400 });
  }

  writeDataBreachIncident({
    title,
    summary,
    severity,
    status,
    request,
    actorId: session.userId,
    actorRole: session.role,
    impactedSystems,
  });

  writeMonitoringEvent({
    category: "security.data_breach.recorded",
    metadata: {
      severity,
      status,
      title,
    },
  });

  return NextResponse.json({ success: true });
}
