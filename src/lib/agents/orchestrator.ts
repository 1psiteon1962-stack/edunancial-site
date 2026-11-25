// ======================================================
// AGENT ORCHESTRATOR (foundation)
// Every agent action becomes a task. The orchestrator checks the
// agent's authority level, records the decision in the audit log,
// and routes ORANGE actions to the owner approval inbox.
// Agents never write to curriculum or publish directly.
// ======================================================

import { getNeonSql } from "@/lib/db/neon";
import { recordAgentAudit } from "./audit";
import { canPerform, isAuthorityLevel, requiresOwnerApproval, type AuthorityLevel } from "./levels";

export type AgentTaskStatus =
  | "queued"
  | "running"
  | "awaiting_approval"
  | "completed"
  | "failed"
  | "refused"
  | "cancelled";

export interface CreateAgentTaskInput {
  agentId: string;
  action: string;
  requiredLevel: AuthorityLevel;
  targetType: string;
  targetId: string;
  jurisdictionCode?: string | null;
  locale?: string | null;
  input?: Record<string, unknown>;
  createdBy: string;
  /** One line shown in the owner inbox when approval is required. */
  approvalSummary?: string;
}

export interface AgentTaskRecord {
  id: string;
  status: AgentTaskStatus;
  refusalReason?: string;
  approvalRequestId?: string;
}

export interface CompleteAgentTaskInput {
  output: Record<string, unknown>;
  model?: string | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
  costUsd?: number | null;
}

function requireSql() {
  const sql = getNeonSql();
  if (!sql) throw new Error("Agent orchestrator requires DATABASE_URL or NETLIFY_DATABASE_URL.");
  return sql;
}

function targetLabel(input: { targetType: string; targetId: string }) {
  return `${input.targetType}:${input.targetId}`;
}

function isOpenTaskConflict(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("agent_tasks_one_open_per_target");
}

export type AgentDecision =
  | { kind: "refuse"; reason: string }
  | { kind: "await_approval" }
  | { kind: "queue" };

/** Pure decision rule, kept separate so it can be tested without a database. */
export function decideAgentTask(
  agent: { enabled: boolean; maxLevel: string } | null,
  requiredLevel: AuthorityLevel,
): AgentDecision {
  if (!agent) return { kind: "refuse", reason: "Agent is not registered." };
  if (!agent.enabled) return { kind: "refuse", reason: "Agent is disabled." };
  if (!isAuthorityLevel(agent.maxLevel)) return { kind: "refuse", reason: "Agent has an invalid authority level." };
  if (!canPerform(agent.maxLevel, requiredLevel)) {
    return { kind: "refuse", reason: `Action requires ${requiredLevel}; agent is limited to ${agent.maxLevel}.` };
  }
  if (requiresOwnerApproval(requiredLevel)) return { kind: "await_approval" };
  return { kind: "queue" };
}

export async function createAgentTask(input: CreateAgentTaskInput): Promise<AgentTaskRecord> {
  if (!isAuthorityLevel(input.requiredLevel)) throw new Error("A valid required authority level is required.");
  const sql = requireSql();
  const rows = await sql`select id, enabled, max_level from agent_registry where id = ${input.agentId} limit 1`;
  const row = rows[0];
  const agent = row ? { enabled: Boolean(row.enabled), maxLevel: String(row.max_level) } : null;
  const decision = decideAgentTask(agent, input.requiredLevel);
  const payload = JSON.stringify(input.input ?? {});
  const target = targetLabel(input);

  if (decision.kind === "refuse") {
    // An unregistered agent cannot own a task row (foreign key), so only the audit event is kept.
    let taskId: string | null = null;
    if (agent) {
      const inserted = await sql`insert into agent_tasks
          (agent_id, action, required_level, target_type, target_id, jurisdiction_code, locale, input, status, error, created_by)
        values (${input.agentId}, ${input.action}, ${input.requiredLevel}, ${input.targetType}, ${input.targetId},
          ${input.jurisdictionCode ?? null}, ${input.locale ?? null}, ${payload}::jsonb, 'refused', ${decision.reason}, ${input.createdBy})
        returning id`;
      taskId = String(inserted[0].id);
    }
    await recordAgentAudit({
      taskId,
      actor: input.agentId,
      action: input.action,
      target,
      result: "refused",
      detail: { reason: decision.reason, requiredLevel: input.requiredLevel, createdBy: input.createdBy },
    });
    return { id: taskId ?? "", status: "refused", refusalReason: decision.reason };
  }

  const status: AgentTaskStatus = decision.kind === "await_approval" ? "awaiting_approval" : "queued";
  let taskId: string;
  let approvalRequestId: string | undefined;
  try {
    if (status === "awaiting_approval") {
      const summary = (input.approvalSummary ?? `${input.agentId}: ${input.action} on ${target}`).slice(0, 500);
      const inserted = await sql`with t as (
          insert into agent_tasks
            (agent_id, action, required_level, target_type, target_id, jurisdiction_code, locale, input, status, created_by)
          values (${input.agentId}, ${input.action}, ${input.requiredLevel}, ${input.targetType}, ${input.targetId},
            ${input.jurisdictionCode ?? null}, ${input.locale ?? null}, ${payload}::jsonb, 'awaiting_approval', ${input.createdBy})
          returning id
        ), a as (
          insert into approval_requests (task_id, summary, payload)
          select id, ${summary}, ${payload}::jsonb from t
          returning id, task_id
        )
        select a.task_id as task_id, a.id as approval_id from a`;
      taskId = String(inserted[0].task_id);
      approvalRequestId = String(inserted[0].approval_id);
    } else {
      const inserted = await sql`insert into agent_tasks
          (agent_id, action, required_level, target_type, target_id, jurisdiction_code, locale, input, status, created_by)
        values (${input.agentId}, ${input.action}, ${input.requiredLevel}, ${input.targetType}, ${input.targetId},
          ${input.jurisdictionCode ?? null}, ${input.locale ?? null}, ${payload}::jsonb, 'queued', ${input.createdBy})
        returning id`;
      taskId = String(inserted[0].id);
    }
  } catch (error) {
    if (isOpenTaskConflict(error)) {
      await recordAgentAudit({
        actor: input.agentId,
        action: input.action,
        target,
        result: "refused",
        detail: { reason: "An open task already exists for this agent and target." },
      });
      throw new Error(`An open ${input.agentId} task already exists for ${target}.`);
    }
    throw error;
  }

  await recordAgentAudit({
    taskId,
    actor: input.agentId,
    action: input.action,
    target,
    result: "success",
    detail: { status, requiredLevel: input.requiredLevel, createdBy: input.createdBy, approvalRequestId },
  });
  return { id: taskId, status, approvalRequestId };
}

export async function completeAgentTask(taskId: string, result: CompleteAgentTaskInput): Promise<void> {
  const sql = requireSql();
  const rows = await sql`update agent_tasks set status = 'completed', output = ${JSON.stringify(result.output)}::jsonb,
      model = ${result.model ?? null}, input_tokens = ${result.inputTokens ?? null},
      output_tokens = ${result.outputTokens ?? null}, cost_usd = ${result.costUsd ?? null},
      error = null, updated_at = now()
    where id = ${taskId} and status in ('queued','running')
    returning agent_id, action, target_type, target_id`;
  if (rows.length !== 1) throw new Error("Only a queued or running task can be completed.");
  const row = rows[0];
  await recordAgentAudit({
    taskId,
    actor: String(row.agent_id),
    action: `${String(row.action)}.completed`,
    target: targetLabel({ targetType: String(row.target_type), targetId: String(row.target_id) }),
    result: "success",
    detail: { model: result.model ?? null, costUsd: result.costUsd ?? null },
  });
}

export async function failAgentTask(taskId: string, error: string): Promise<void> {
  const sql = requireSql();
  const message = error.slice(0, 2000);
  const rows = await sql`update agent_tasks set status = 'failed', error = ${message}, updated_at = now()
    where id = ${taskId} and status in ('queued','running')
    returning agent_id, action, target_type, target_id`;
  if (rows.length !== 1) throw new Error("Only a queued or running task can be marked failed.");
  const row = rows[0];
  await recordAgentAudit({
    taskId,
    actor: String(row.agent_id),
    action: `${String(row.action)}.failed`,
    target: targetLabel({ targetType: String(row.target_type), targetId: String(row.target_id) }),
    result: "failure",
    detail: { error: message },
  });
}

export async function decideApproval(
  requestId: string,
  decision: "approved" | "rejected",
  actor: string,
  note?: string | null,
): Promise<{ requestId: string; taskId: string; taskStatus: AgentTaskStatus }> {
  if (decision !== "approved" && decision !== "rejected") throw new Error("Decision must be approved or rejected.");
  if (!actor.trim()) throw new Error("An approving actor is required.");
  const sql = requireSql();
  const taskStatus: AgentTaskStatus = decision === "approved" ? "queued" : "cancelled";
  const rows = await sql`with d as (
      update approval_requests set status = ${decision}, decided_by = ${actor}, decision_note = ${note ?? null}, decided_at = now()
      where id = ${requestId} and status = 'pending'
      returning task_id
    ), t as (
      update agent_tasks set status = ${taskStatus}, updated_at = now()
      where id in (select task_id from d) and status = 'awaiting_approval'
      returning id, agent_id, action, target_type, target_id
    )
    select d.task_id, t.agent_id, t.action, t.target_type, t.target_id from d left join t on t.id = d.task_id`;
  if (rows.length !== 1) throw new Error("Approval request is not pending.");
  const row = rows[0];
  const taskId = String(row.task_id);
  await recordAgentAudit({
    taskId,
    actor,
    action: `approval.${decision}`,
    target: row.target_type ? targetLabel({ targetType: String(row.target_type), targetId: String(row.target_id) }) : `task:${taskId}`,
    result: "success",
    detail: { requestId, note: note ?? null, agentId: row.agent_id ?? null },
  });
  return { requestId, taskId, taskStatus };
}
