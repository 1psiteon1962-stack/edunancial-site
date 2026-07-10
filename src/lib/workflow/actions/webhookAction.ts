import { ActionExecutor } from "../actionRegistry";
import { ActionInput, ActionOutput } from "../workflowTypes";
import crypto from "crypto";

const DEFAULT_TIMEOUT_MS = 10000;

export const webhookActionExecutor: ActionExecutor = {
  actionType: "trigger_webhook",
  name: "Trigger Webhook",
  description:
    "POST a signed webhook payload to a registered endpoint",
  configSchema: {
    url: "string — webhook endpoint URL",
    secret: "string — optional HMAC signing secret",
    event: "string — event name to include in the payload",
    includePayload: "boolean — whether to include the trigger payload",
    timeoutMs: "number — request timeout in ms (default 10000)",
  },
  async execute(input: ActionInput): Promise<ActionOutput> {
    const { config, triggerPayload, executionContext } = input;
    const url = String(config.url ?? "");
    const secret = String(config.secret ?? "");
    const event = String(config.event ?? executionContext.triggerEvent);
    const timeoutMs = Number(config.timeoutMs ?? DEFAULT_TIMEOUT_MS);

    if (!url) {
      return { success: false, error: "url is required for trigger_webhook action" };
    }

    // Validate URL
    try {
      const parsed = new URL(url);
      if (
        parsed.hostname === "localhost" ||
        parsed.hostname === "127.0.0.1" ||
        parsed.hostname.endsWith(".local")
      ) {
        return { success: false, error: "Internal URLs are not permitted" };
      }
    } catch {
      return { success: false, error: "Invalid webhook URL" };
    }

    const webhookBody = {
      event,
      executionId: executionContext.executionId,
      workflowId: executionContext.workflowId,
      timestamp: new Date().toISOString(),
      ...(config.includePayload ? { payload: triggerPayload } : {}),
    };

    const bodyStr = JSON.stringify(webhookBody);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Edunancial-Event": event,
      "X-Edunancial-Delivery": executionContext.executionId,
    };

    // Sign the payload with HMAC-SHA256 if a secret is provided
    if (secret) {
      const sig = crypto
        .createHmac("sha256", secret)
        .update(bodyStr)
        .digest("hex");
      headers["X-Edunancial-Signature-256"] = `sha256=${sig}`;
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: bodyStr,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        return {
          success: false,
          error: `Webhook endpoint responded with ${response.status}`,
        };
      }

      return {
        success: true,
        result: {
          url,
          event,
          status: response.status,
          deliveredAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Webhook delivery failed: ${message}` };
    }
  },
};
