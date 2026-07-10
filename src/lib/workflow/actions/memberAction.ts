import { ActionExecutor } from "../actionRegistry";
import { ActionInput, ActionOutput } from "../workflowTypes";

export const memberActionExecutor: ActionExecutor = {
  actionType: "update_member",
  name: "Update Member Record",
  description: "Update fields on a member's profile or account",
  configSchema: {
    userId: "string — target user (supports {{triggerPayload.userId}})",
    fields: "object — key-value map of fields to update",
  },
  async execute(input: ActionInput): Promise<ActionOutput> {
    const { config, triggerPayload } = input;
    const userId = String(config.userId ?? triggerPayload.userId ?? "");
    const fields = (config.fields as Record<string, unknown>) ?? {};

    if (!userId) {
      return { success: false, error: "userId is required" };
    }
    if (Object.keys(fields).length === 0) {
      return { success: false, error: "At least one field must be specified" };
    }

    // In production: update member record in database
    console.log(`[MemberAction] Updating member ${userId}:`, fields);

    return {
      success: true,
      result: { userId, updatedFields: Object.keys(fields), updatedAt: new Date().toISOString() },
    };
  },
};
