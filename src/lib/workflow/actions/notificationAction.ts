import { ActionExecutor } from "../actionRegistry";
import { ActionInput, ActionOutput } from "../workflowTypes";

export const notificationActionExecutor: ActionExecutor = {
  actionType: "send_notification",
  name: "Send Notification",
  description: "Send an in-app notification to a user",
  configSchema: {
    userId: "string — target user (supports {{triggerPayload.userId}})",
    title: "string — notification title",
    message: "string — notification body",
    priority: "string — low | medium | high",
  },
  async execute(input: ActionInput): Promise<ActionOutput> {
    const { config, triggerPayload } = input;
    const userId = String(config.userId ?? triggerPayload.userId ?? "");
    const title = String(config.title ?? "");
    const message = String(config.message ?? "");
    const priority = String(config.priority ?? "medium");

    if (!userId) {
      return { success: false, error: "userId is required for notification" };
    }
    if (!title) {
      return { success: false, error: "Notification title is required" };
    }

    // In production: persist to notifications table / push to realtime channel
    console.log(`[NotificationAction] Notify user ${userId}: ${title}`);

    return {
      success: true,
      result: {
        userId,
        title,
        message,
        priority,
        sentAt: new Date().toISOString(),
      },
    };
  },
};
