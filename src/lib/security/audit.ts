import { redactSensitiveData } from "./privacy";

type AuditOutcome = "blocked" | "failure" | "success";
type AuditSeverity = "critical" | "error" | "info" | "warning";

export function getRequestId(request: Request): string {
  return request.headers.get("x-request-id") ?? crypto.randomUUID();
}

export function writeAuditLog(entry: {
  action: string;
  actorId?: string | null;
  actorRole?: string | null;
  target: string;
  outcome: AuditOutcome;
  request: Request;
  metadata?: Record<string, unknown>;
}) {
  const payload = {
    type: "audit",
    action: entry.action,
    actorId: entry.actorId ?? "anonymous",
    actorRole: entry.actorRole ?? "guest",
    ipAddress:
      entry.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
    outcome: entry.outcome,
    requestId: getRequestId(entry.request),
    target: entry.target,
    timestamp: new Date().toISOString(),
    metadata: redactSensitiveData(entry.metadata ?? {}),
  };

  console.info(JSON.stringify(payload));
}

export function writeSecurityEvent(entry: {
  event: string;
  severity: AuditSeverity;
  request?: Request;
  metadata?: Record<string, unknown>;
}) {
  const payload = {
    type: "security_event",
    event: entry.event,
    severity: entry.severity,
    requestId: entry.request ? getRequestId(entry.request) : crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    metadata: redactSensitiveData(entry.metadata ?? {}),
  };

  const serialized = JSON.stringify(payload);

  if (entry.severity === "critical" || entry.severity === "error") {
    console.error(serialized);
    return;
  }

  if (entry.severity === "warning") {
    console.warn(serialized);
    return;
  }

  console.info(serialized);
}

export function writeDataBreachIncident(entry: {
  title: string;
  summary: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "investigating" | "contained" | "resolved";
  request: Request;
  actorId?: string | null;
  actorRole?: string | null;
  impactedSystems?: string[];
}) {
  const payload = {
    type: "data_breach_incident",
    title: entry.title,
    summary: entry.summary,
    severity: entry.severity,
    status: entry.status,
    impactedSystems: entry.impactedSystems ?? [],
  };

  writeAuditLog({
    action: "security.data_breach.recorded",
    actorId: entry.actorId,
    actorRole: entry.actorRole,
    target: "data-breach-framework",
    outcome: "success",
    request: entry.request,
    metadata: payload,
  });
}
