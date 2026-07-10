import { ActionExecutor } from "../actionRegistry";
import { ActionInput, ActionOutput } from "../workflowTypes";

export const auditLogActionExecutor: ActionExecutor = {
  actionType: "write_audit_log",
  name: "Write Audit Log",
  description: "Append an entry to the system audit log",
  configSchema: {
    action: "string — action label",
    entity: "string — affected entity type",
    entityId: "string — affected entity id (supports {{triggerPayload.userId}})",
    details: "object — optional additional details",
  },
  async execute(input: ActionInput): Promise<ActionOutput> {
    const { config, triggerPayload, executionContext } = input;
    const action = String(config.action ?? executionContext.triggerEvent);
    const entity = String(config.entity ?? "workflow_execution");
    const entityId = String(
      config.entityId ?? triggerPayload.userId ?? executionContext.executionId
    );
    const details = (config.details as Record<string, unknown>) ?? {};

    const entry = {
      id: `al_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      action,
      entity,
      entityId,
      workflowExecutionId: executionContext.executionId,
      workflowId: executionContext.workflowId,
      details,
      timestamp: new Date().toISOString(),
    };

    // In production: persist to audit_logs table
    console.log("[AuditLogAction] Audit entry:", entry);

    return {
      success: true,
      result: { auditEntryId: entry.id, loggedAt: entry.timestamp },
    };
  },
};
