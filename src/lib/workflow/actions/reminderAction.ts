import { ActionExecutor } from "../actionRegistry";
import { ActionInput, ActionOutput } from "../workflowTypes";

export const reminderActionExecutor: ActionExecutor = {
  actionType: "schedule_reminder",
  name: "Schedule Reminder",
  description: "Schedule a future reminder notification or email for a user",
  configSchema: {
    userId: "string — target user (supports {{triggerPayload.userId}})",
    delayMs: "number — delay in milliseconds before sending",
    channel: "string — email | notification | both",
    subject: "string — reminder subject/title",
    message: "string — reminder body",
  },
  async execute(input: ActionInput): Promise<ActionOutput> {
    const { config, triggerPayload } = input;
    const userId = String(config.userId ?? triggerPayload.userId ?? "");
    const delayMs = Number(config.delayMs ?? 86400000); // default 24h
    const channel = String(config.channel ?? "notification");
    const subject = String(config.subject ?? "Reminder");

    if (!userId) {
      return { success: false, error: "userId is required" };
    }

    const scheduledAt = new Date(Date.now() + delayMs).toISOString();

    // In production: enqueue a scheduled job (e.g., via cron service or job queue)
    console.log(`[ReminderAction] Scheduling ${channel} reminder for ${userId} at ${scheduledAt}`);

    return {
      success: true,
      result: {
        userId,
        channel,
        subject,
        scheduledAt,
      },
    };
  },
};
