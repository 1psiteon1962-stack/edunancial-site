import { WorkflowActionType, ActionInput, ActionOutput } from "./workflowTypes";

// ─── Action executor interface ────────────────────────────────────────────────

export interface ActionExecutor {
  actionType: WorkflowActionType;
  name: string;
  description: string;
  configSchema: Record<string, string>;
  execute(input: ActionInput): Promise<ActionOutput>;
}

// ─── Action registry ──────────────────────────────────────────────────────────

class ActionRegistry {
  private executors: Map<WorkflowActionType, ActionExecutor> = new Map();

  register(executor: ActionExecutor): void {
    this.executors.set(executor.actionType, executor);
  }

  getExecutor(actionType: WorkflowActionType): ActionExecutor | undefined {
    return this.executors.get(actionType);
  }

  listExecutors(): ActionExecutor[] {
    return Array.from(this.executors.values());
  }
}

export const actionRegistry = new ActionRegistry();

// ─── Register all built-in action executors ───────────────────────────────────

import { emailActionExecutor } from "./actions/emailAction";
import { notificationActionExecutor } from "./actions/notificationAction";
import { memberActionExecutor } from "./actions/memberAction";
import { achievementActionExecutor } from "./actions/achievementAction";
import { certificateActionExecutor } from "./actions/certificateAction";
import { reminderActionExecutor } from "./actions/reminderAction";
import { apiCallActionExecutor } from "./actions/apiCallAction";
import { webhookActionExecutor } from "./actions/webhookAction";
import { auditLogActionExecutor } from "./actions/auditLogAction";
import { adminTaskActionExecutor } from "./actions/adminTaskAction";

for (const executor of [
  emailActionExecutor,
  notificationActionExecutor,
  memberActionExecutor,
  achievementActionExecutor,
  certificateActionExecutor,
  reminderActionExecutor,
  apiCallActionExecutor,
  webhookActionExecutor,
  auditLogActionExecutor,
  adminTaskActionExecutor,
]) {
  actionRegistry.register(executor);
}
