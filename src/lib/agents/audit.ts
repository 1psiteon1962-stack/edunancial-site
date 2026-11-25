import { getNeonSql } from "@/lib/db/neon";
import { redactAuditDetail } from "./redact";

export type AgentAuditResult = "success" | "failure" | "refused";

export interface AgentAuditInput {
  taskId?: string | null;
  actor: string;
  action: string;
  target: string;
  result: AgentAuditResult;
  detail?: Record<string, unknown>;
}

/** Appends one row to agent_audit_events. Rows can never be changed afterwards. */
export async function recordAgentAudit(input: AgentAuditInput): Promise<void> {
  const sql = getNeonSql();
  if (!sql) throw new Error("Agent audit log requires DATABASE_URL or NETLIFY_DATABASE_URL.");
  const detail = JSON.stringify(redactAuditDetail(input.detail));
  await sql`insert into agent_audit_events (task_id, actor, action, target, result, detail)
    values (${input.taskId ?? null}, ${input.actor}, ${input.action}, ${input.target}, ${input.result}, ${detail}::jsonb)`;
}
