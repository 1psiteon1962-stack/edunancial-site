/**
 * AI Coach Audit Logger
 * Privacy-by-design: logs coach actions for CCPA/CPRA, PIPEDA, Quebec Law 25 compliance.
 * No PII is stored in audit entries; memberId is a reference only.
 */

import { AICoachAuditEvent } from "@/types/ai-coach";

/** In-memory store for current session — replace with database writes in production. */
const auditLog: AICoachAuditEvent[] = [];

export function logAICoachEvent(
  event: Omit<AICoachAuditEvent, "id" | "timestamp">
): AICoachAuditEvent {
  const entry: AICoachAuditEvent = {
    ...event,
    id: `ae-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };

  auditLog.push(entry);

  return entry;
}

export function getAuditLog(memberId: string): AICoachAuditEvent[] {
  return auditLog.filter((e) => e.memberId === memberId);
}

export function getRecentAuditEvents(
  memberId: string,
  limit = 50
): AICoachAuditEvent[] {
  return auditLog
    .filter((e) => e.memberId === memberId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, limit);
}
