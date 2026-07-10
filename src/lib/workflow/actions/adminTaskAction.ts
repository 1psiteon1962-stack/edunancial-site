import { ActionExecutor } from "../actionRegistry";
import { ActionInput, ActionOutput } from "../workflowTypes";
import { workflowStore } from "../workflowStore";
import { AdminTask } from "../workflowTypes";

export const adminTaskActionExecutor: ActionExecutor = {
  actionType: "create_admin_task",
  name: "Create Administrative Task",
  description: "Create a task for an administrator to action",
  configSchema: {
    title: "string — task title",
    description: "string — task description",
    assignedRole: "string — admin role to assign (default: admin)",
    priority: "string — low | medium | high | critical",
    dueDays: "number — number of days until due (optional)",
  },
  async execute(input: ActionInput): Promise<ActionOutput> {
    const { config, executionContext } = input;
    const title = String(config.title ?? "Workflow-generated task");
    const description = String(config.description ?? "");
    const assignedRole = String(config.assignedRole ?? "admin");
    const priority = (config.priority as AdminTask["priority"]) ?? "medium";
    const dueDays = config.dueDays ? Number(config.dueDays) : undefined;

    const task: AdminTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title,
      description,
      assignedRole,
      priority,
      status: "open",
      createdAt: new Date().toISOString(),
      dueAt: dueDays
        ? new Date(Date.now() + dueDays * 86400000).toISOString()
        : undefined,
      workflowExecutionId: executionContext.executionId,
    };

    workflowStore.saveAdminTask(task);

    console.log(`[AdminTaskAction] Created task: ${task.id} — ${task.title}`);

    return {
      success: true,
      result: {
        taskId: task.id,
        title: task.title,
        assignedRole: task.assignedRole,
        createdAt: task.createdAt,
      },
    };
  },
};
