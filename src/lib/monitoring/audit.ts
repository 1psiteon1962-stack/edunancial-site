/**
 * Audit logging.
 * Records security-relevant actions: auth events, permission changes, data mutations.
 */

import { logger } from "./logger";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuditAction =
  | "auth.login"
  | "auth.logout"
  | "auth.token_issued"
  | "auth.token_revoked"
  | "auth.failed"
  | "apikey.created"
  | "apikey.revoked"
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "role.changed"
  | "permission.denied"
  | "webhook.received"
  | "webhook.delivered"
  | "payment.initiated"
  | "payment.completed"
  | "payment.refunded"
  | "certificate.issued"
  | "admin.action";

export interface AuditEntry {
  action: AuditAction;
  actorId?: string;
  actorType?: "user" | "service" | "api_key" | "system";
  targetId?: string;
  targetType?: string;
  requestId?: string;
  ip?: string;
  result: "success" | "failure";
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// ─── Audit sink ───────────────────────────────────────────────────────────────

export interface AuditSink {
  log(entry: AuditEntry): void | Promise<void>;
}

const auditSinks: AuditSink[] = [];

export function addAuditSink(sink: AuditSink): void {
  auditSinks.push(sink);
}

// ─── Core audit function ──────────────────────────────────────────────────────

export function audit(
  action: AuditAction,
  params: Omit<AuditEntry, "action" | "timestamp">
): void {
  const entry: AuditEntry = {
    action,
    ...params,
    timestamp: new Date().toISOString(),
  };

  // Structured log (always)
  logger.info("audit", { ...entry });

  // Fan out to sinks
  for (const sink of auditSinks) {
    void Promise.resolve(sink.log(entry)).catch((err) => {
      logger.warn("audit.sink.error", { error: String(err) });
    });
  }
}
