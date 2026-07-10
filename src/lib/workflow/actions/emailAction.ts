import { ActionExecutor } from "../actionRegistry";
import { ActionInput, ActionOutput } from "../workflowTypes";

export const emailActionExecutor: ActionExecutor = {
  actionType: "send_email",
  name: "Send Email",
  description: "Send an email to a recipient using a template or custom content",
  configSchema: {
    to: "string — recipient address (supports {{triggerPayload.email}})",
    subject: "string — email subject",
    templateId: "string — optional template identifier",
    body: "string — optional HTML body (used when no templateId)",
    fromName: "string — optional sender display name",
  },
  async execute(input: ActionInput): Promise<ActionOutput> {
    const { config, triggerPayload } = input;
    const to = resolveTemplate(String(config.to ?? triggerPayload.email ?? ""), triggerPayload);
    const subject = resolveTemplate(String(config.subject ?? ""), triggerPayload);

    if (!to) {
      return { success: false, error: "Email recipient (to) is required" };
    }

    // In production: call email provider (SendGrid, Postmark, etc.)
    console.log(`[EmailAction] Sending email to ${to}: ${subject}`);

    return {
      success: true,
      result: { to, subject, sentAt: new Date().toISOString() },
    };
  },
};

function resolveTemplate(
  template: string,
  payload: Record<string, unknown>
): string {
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path: string) => {
    const keys = path.split(".");
    let val: unknown = payload;
    for (const key of keys) {
      if (val && typeof val === "object" && key in (val as object)) {
        val = (val as Record<string, unknown>)[key];
      } else {
        return "";
      }
    }
    return String(val ?? "");
  });
}
