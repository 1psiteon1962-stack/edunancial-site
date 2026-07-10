import { ActionExecutor } from "../actionRegistry";
import { ActionInput, ActionOutput } from "../workflowTypes";

export const achievementActionExecutor: ActionExecutor = {
  actionType: "award_achievement",
  name: "Award Achievement",
  description: "Award a badge or achievement to a member",
  configSchema: {
    userId: "string — target user (supports {{triggerPayload.userId}})",
    achievementId: "string — achievement identifier",
    achievementTitle: "string — display title",
    achievementIcon: "string — optional icon identifier",
  },
  async execute(input: ActionInput): Promise<ActionOutput> {
    const { config, triggerPayload } = input;
    const userId = String(config.userId ?? triggerPayload.userId ?? "");
    const achievementId = String(config.achievementId ?? "");
    const achievementTitle = String(config.achievementTitle ?? "");

    if (!userId) {
      return { success: false, error: "userId is required" };
    }
    if (!achievementId) {
      return { success: false, error: "achievementId is required" };
    }

    // In production: persist achievement to database and send notification
    console.log(`[AchievementAction] Awarding ${achievementTitle} to ${userId}`);

    return {
      success: true,
      result: {
        userId,
        achievementId,
        achievementTitle,
        awardedAt: new Date().toISOString(),
      },
    };
  },
};
