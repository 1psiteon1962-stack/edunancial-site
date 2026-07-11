/**
 * AI provider abstraction layer.
 *
 * Supports:
 *  - MockProvider: always available, returns educational responses without API calls.
 *    Used when no AI API key is configured. Safe for demos and development.
 *  - OpenAIProvider: activated when OPENAI_API_KEY is set. Streams real completions.
 *
 * To add a new provider (Anthropic, Gemini, etc.), implement the AIProvider interface
 * and add it to getProvider().
 */

import type {
  AIProvider,
  AIProviderOptions,
  AIChatMessage,
  AIChatResponse,
} from "./types";
import { buildSystemPrompt } from "./prompts";

// ---------------------------------------------------------------------------
// Mock Provider — educational fallback, no API key needed
// ---------------------------------------------------------------------------

const MOCK_RESPONSES: string[] = [
  "Financial competency is built through disciplined action — not just knowledge. Edunancial's three learning paths (Real Estate, Paper Assets, and Business) are designed to take you from understanding to application.\n\nWhat area would you like to focus on today: real estate (RED), paper assets (WHITE), or business (BLUE)?",

  "Great question! The key difference between financial literacy and financial competency is action. Literacy means you understand concepts like compound interest or diversification. Competency means you've practiced applying them to real decisions.\n\nEdunancial's courses are structured to bridge that gap. Would you like course recommendations based on your current knowledge level?",

  "Real estate investing (the RED path) covers fundamentals like cash flow analysis, property valuation, financing strategies, and market cycle awareness. Before investing, it's important to understand your numbers — specifically cash-on-cash return and cap rate.\n\nI recommend consulting with a licensed real estate professional and tax advisor before making investment decisions. Would you like to explore the RED path courses?",

  "Paper assets (the WHITE path) include stocks, bonds, ETFs, mutual funds, and other securities. Key competencies include understanding portfolio diversification, risk tolerance, tax-advantaged accounts, and market cycles.\n\nRemember: past performance does not guarantee future results. For personalized investment advice, consult a licensed financial advisor. Want to start building your WHITE path competency?",

  "Building a business (the BLUE path) requires mastering cash flow, systems, team leadership, and scaling strategies. Many entrepreneurs focus on revenue but miss the importance of profit margins, operating expenses, and working capital.\n\nEdunancial's business competency modules walk through each of these areas. Where are you in your entrepreneurship journey?",

  "Your Financial Competency Score measures progress across all three asset classes: Real Estate (RED), Paper Assets (WHITE), and Business (BLUE). As you complete courses, assessments, and apply skills in the real world, your score grows.\n\nWould you like to take the free assessment to see where you stand today?",
];

let mockIndex = 0;

async function* mockStream(response: string): AsyncGenerator<string> {
  const words = response.split(" ");
  for (const word of words) {
    yield word + " ";
    await new Promise((r) => setTimeout(r, 15));
  }
}

const MockProvider: AIProvider = {
  name: "mock",
  available: true,

  async *streamChat(
    messages: AIChatMessage[],
    options: AIProviderOptions
  ): AsyncGenerator<string> {
    void messages;
    void options;
    const response = MOCK_RESPONSES[mockIndex % MOCK_RESPONSES.length];
    mockIndex += 1;
    yield* mockStream(response);
  },

  async chat(
    messages: AIChatMessage[],
    options: AIProviderOptions
  ): Promise<AIChatResponse> {
    void messages;
    const content = MOCK_RESPONSES[mockIndex % MOCK_RESPONSES.length];
    mockIndex += 1;
    return {
      content,
      conversationId: options.conversationId,
      region: options.region,
      locale: options.locale,
      model: "mock",
      finishReason: "stop",
    };
  },
};

// ---------------------------------------------------------------------------
// OpenAI Provider — activated when OPENAI_API_KEY is set
// ---------------------------------------------------------------------------

function buildAuthHeader(apiKey: string): string {
  return "Bearer " + apiKey;
}

const OpenAIProvider: AIProvider = {
  name: "openai",
  available: Boolean(process.env.OPENAI_API_KEY),

  async *streamChat(
    messages: AIChatMessage[],
    options: AIProviderOptions
  ): AsyncGenerator<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

    const systemPrompt = buildSystemPrompt(options.region, options.locale);
    const body = JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
      max_tokens: options.maxTokens ?? 800,
      temperature: options.temperature ?? 0.7,
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: buildAuthHeader(apiKey),
      },
      body,
    });

    if (!response.ok || !response.body) {
      throw new Error("OpenAI API error: " + response.status);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;
        const data = trimmed.slice(6);
        if (data === "[DONE]") return;
        try {
          const parsed = JSON.parse(data) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          // malformed SSE line — skip
        }
      }
    }
  },

  async chat(
    messages: AIChatMessage[],
    options: AIProviderOptions
  ): Promise<AIChatResponse> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

    const systemPrompt = buildSystemPrompt(options.region, options.locale);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: buildAuthHeader(apiKey),
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: false,
        max_tokens: options.maxTokens ?? 800,
        temperature: options.temperature ?? 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API error: " + response.status);
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: { content?: string };
        finish_reason?: string;
      }>;
      model?: string;
    };

    const content = data.choices?.[0]?.message?.content ?? "";
    const finishReason =
      data.choices?.[0]?.finish_reason === "length" ? "length" : "stop";

    return {
      content,
      conversationId: options.conversationId,
      region: options.region,
      locale: options.locale,
      model: data.model ?? "gpt-4o-mini",
      finishReason,
    };
  },
};

// ---------------------------------------------------------------------------
// Provider registry
// ---------------------------------------------------------------------------

const PROVIDERS: AIProvider[] = [OpenAIProvider, MockProvider];

/**
 * Return the first available provider.
 * OpenAI is preferred when OPENAI_API_KEY is set; falls back to Mock.
 */
export function getProvider(): AIProvider {
  return PROVIDERS.find((p) => p.available) ?? MockProvider;
}

export { MockProvider, OpenAIProvider };
