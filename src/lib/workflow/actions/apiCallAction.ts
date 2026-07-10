import { ActionExecutor } from "../actionRegistry";
import { ActionInput, ActionOutput } from "../workflowTypes";

const DEFAULT_TIMEOUT_MS = 10000;

export const apiCallActionExecutor: ActionExecutor = {
  actionType: "call_api",
  name: "Call External API",
  description: "Make an authenticated HTTP request to an external API",
  configSchema: {
    url: "string — target URL",
    method: "string — GET | POST | PUT | PATCH | DELETE",
    headers: "object — request headers",
    body: "object — request body (for POST/PUT/PATCH)",
    timeoutMs: "number — request timeout in ms (default 10000)",
    authHeader: "string — optional Authorization header value",
  },
  async execute(input: ActionInput): Promise<ActionOutput> {
    const { config } = input;
    const url = String(config.url ?? "");
    const method = String(config.method ?? "GET").toUpperCase();
    const timeoutMs = Number(config.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(config.headers as Record<string, string> ?? {}),
    };

    if (config.authHeader) {
      headers["Authorization"] = String(config.authHeader);
    }

    if (!url) {
      return { success: false, error: "url is required for call_api action" };
    }

    // Validate URL is not internal/loopback to prevent SSRF
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
      return { success: false, error: "Invalid URL" };
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        method,
        headers,
        body:
          method !== "GET" && config.body
            ? JSON.stringify(config.body)
            : undefined,
        signal: controller.signal,
      });

      clearTimeout(timer);

      const responseText = await response.text();
      let responseData: unknown;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      if (!response.ok) {
        return {
          success: false,
          error: `API responded with ${response.status}: ${responseText.slice(0, 200)}`,
        };
      }

      return {
        success: true,
        result: {
          status: response.status,
          response: responseData as Record<string, unknown>,
          calledAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `API call failed: ${message}` };
    }
  },
};
