import { logger } from "@/lib/observability/logger";

export interface AuditLog {
  id: string;
  userId: string;
  role: string;
  region: string;
  country: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  ipAddress: string;
}

export type AuditResult = "success" | "failure";

export interface AuditEvent {
  actor: string;
  action: string;
  target: string;
  result: AuditResult;
  timestamp?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}

export function createAuditLog(entry: AuditLog) {
  return {
    ...entry,
  };
}

export function logAuditEvent(entry: AuditEvent): AuditEvent {
  const record: AuditEvent = {
    ...entry,
    timestamp: entry.timestamp ?? new Date().toISOString(),
  };

  logger.info("audit.event", {
    actor: record.actor,
    action: record.action,
    target: record.target,
    result: record.result,
    timestamp: record.timestamp,
    requestId: record.requestId,
    metadata: record.metadata,
  });

  return record;
}

export function logAuthAuditEvent(entry: Omit<AuditEvent, "target"> & { target?: string }) {
  return logAuditEvent({
    target: entry.target ?? "authentication",
    ...entry,
  });
}

export function logAdminAuditEvent(entry: Omit<AuditEvent, "target"> & { target?: string }) {
  return logAuditEvent({
    target: entry.target ?? "administration",
    ...entry,
  });
}
