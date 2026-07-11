/**
 * POST /api/ai/chat
 *
 * Production AI chat endpoint with:
 * - Input validation and sanitization
 * - Region/locale context awareness
 * - Provider abstraction (OpenAI → Mock fallback)
 * - In-memory rate limiting (20 req/min per IP)
 * - PII-safe logging (message content never logged)
 * - Streaming via Server-Sent Events (ReadableStream)
 * - Graceful error handling
 */

import { NextResponse } from "next/server";
import { getProvider } from "@/lib/ai/provider";
import { buildSystemPrompt, sanitizeUserInput, MAX_HISTORY_TURNS } from "@/lib/ai/prompts";
import { checkRateLimit, AI_CHAT_RATE_LIMIT } from "@/lib/ai/rateLimit";
import type { AIChatMessage, AIRegion, AILocale } from "@/lib/ai/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function resolveRegion(raw?: string): AIRegion {
  if (raw === "ca") return "ca";
  if (raw === "global") return "global";
  return "us";
}

function resolveLocale(raw?: string): AILocale {
  const supported: AILocale[] = ["en", "es", "fr", "ko", "ja", "tl", "ar", "pt"];
  if (raw && (supported as string[]).includes(raw)) return raw as AILocale;
  return "en";
}

function validateMessage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = sanitizeUserInput(value);
  if (cleaned.length === 0) return null;
  return cleaned;
}

function validateHistory(value: unknown): AIChatMessage[] {
  if (!Array.isArray(value)) return [];
  const valid: AIChatMessage[] = [];
  for (const item of value.slice(-MAX_HISTORY_TURNS * 2)) {
    if (
      typeof item === "object" &&
      item !== null &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string"
    ) {
      valid.push({
        role: item.role as "user" | "assistant",
        content: sanitizeUserInput(item.content as string),
      });
    }
  }
  return valid;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: Request): Promise<Response> {
  // Rate limiting
  const clientId = getClientIdentifier(request);
  const rateResult = checkRateLimit(clientId, AI_CHAT_RATE_LIMIT);

  if (!rateResult.allowed) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: "Too many requests. Please wait before sending another message.",
        resetAtMs: rateResult.resetAtMs,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateResult.resetAtMs - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateResult.resetAtMs),
        },
      }
    );
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  // Validate required fields
  const message = validateMessage(body.message);
  if (!message) {
    return NextResponse.json(
      { error: "invalid_message", message: "Field 'message' is required and must be a non-empty string (max 2000 chars)." },
      { status: 400 }
    );
  }

  const region = resolveRegion(body.region as string | undefined);
  const locale = resolveLocale(body.locale as string | undefined);
  const history = validateHistory(body.history);
  const conversationId =
    typeof body.conversationId === "string" && body.conversationId.length > 0
      ? body.conversationId.slice(0, 128)
      : crypto.randomUUID();

  // Log request metadata — never log message content (PII-safe)
  console.log("[ai/chat]", {
    conversationId,
    region,
    locale,
    historyTurns: history.length,
    clientIdHash: clientId.replace(/\d/g, "*"), // partial redaction
    streaming: request.headers.get("accept")?.includes("text/event-stream") ?? false,
  });

  const provider = getProvider();

  // Build messages for the provider (system prompt is added by the provider)
  const messages: AIChatMessage[] = [
    ...history,
    { role: "user", content: message },
  ];

  const providerOptions = {
    region,
    locale,
    conversationId,
    maxTokens: 800,
    temperature: 0.7,
  };

  // Streaming response
  const wantsStream =
    request.headers.get("accept")?.includes("text/event-stream") ||
    body.stream === true;

  if (wantsStream) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        function enqueue(data: string) {
          controller.enqueue(encoder.encode(data));
        }

        // Send conversation ID immediately
        enqueue(
          "data: " +
            JSON.stringify({ type: "start", conversationId, region, locale }) +
            "\n\n"
        );

        try {
          for await (const delta of provider.streamChat(messages, providerOptions)) {
            enqueue("data: " + JSON.stringify({ type: "delta", delta }) + "\n\n");
          }
          enqueue(
            "data: " +
              JSON.stringify({ type: "done", conversationId, finishReason: "stop" }) +
              "\n\n"
          );
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : "Unknown error";
          console.error("[ai/chat] stream error:", errorMsg);
          enqueue(
            "data: " +
              JSON.stringify({ type: "error", message: "AI service temporarily unavailable." }) +
              "\n\n"
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-store",
        Connection: "keep-alive",
        "X-RateLimit-Remaining": String(rateResult.remaining),
        "X-Conversation-Id": conversationId,
      },
    });
  }

  // Non-streaming response
  try {
    const result = await provider.chat(messages, providerOptions);
    void buildSystemPrompt; // imported for side effects only in non-streaming path
    return NextResponse.json(
      {
        content: result.content,
        conversationId: result.conversationId,
        region: result.region,
        locale: result.locale,
        model: result.model,
        finishReason: result.finishReason,
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateResult.remaining),
          "X-Conversation-Id": conversationId,
        },
      }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("[ai/chat] error:", errorMsg);
    return NextResponse.json(
      { error: "ai_error", message: "AI service temporarily unavailable. Please try again." },
      { status: 503 }
    );
  }
}

/** Health check */
export async function GET(): Promise<Response> {
  const provider = getProvider();
  return NextResponse.json({
    status: "ok",
    provider: provider.name,
    regions: ["us", "ca", "global"],
    locales: ["en", "es", "fr", "ko", "ja", "tl", "ar", "pt"],
  });
}
