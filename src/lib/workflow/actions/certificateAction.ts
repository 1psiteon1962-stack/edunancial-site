import { ActionExecutor } from "../actionRegistry";
import { ActionInput, ActionOutput } from "../workflowTypes";

export const certificateActionExecutor: ActionExecutor = {
  actionType: "generate_certificate",
  name: "Generate Certificate",
  description: "Generate and deliver a completion certificate to a member",
  configSchema: {
    userId: "string — target user (supports {{triggerPayload.userId}})",
    courseId: "string — course identifier (supports {{triggerPayload.courseId}})",
    courseName: "string — display name",
    templateId: "string — certificate template identifier",
  },
  async execute(input: ActionInput): Promise<ActionOutput> {
    const { config, triggerPayload } = input;
    const userId = String(config.userId ?? triggerPayload.userId ?? "");
    const courseId = String(config.courseId ?? triggerPayload.courseId ?? "");
    const courseName = String(
      config.courseName ?? triggerPayload.courseName ?? "Course"
    );

    if (!userId) {
      return { success: false, error: "userId is required" };
    }
    if (!courseId) {
      return { success: false, error: "courseId is required" };
    }

    const certificateId = `cert_${userId}_${courseId}_${Date.now()}`;

    // In production: generate PDF, upload to storage, record in database
    console.log(`[CertificateAction] Generating certificate ${certificateId} for ${userId}`);

    return {
      success: true,
      result: {
        certificateId,
        userId,
        courseId,
        courseName,
        generatedAt: new Date().toISOString(),
        downloadUrl: `/certificates/${certificateId}`,
      },
    };
  },
};
