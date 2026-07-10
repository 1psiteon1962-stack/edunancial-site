/**
 * AI provider adapter with multi-provider support.
 *
 * Supports:
 *   - OpenAI   (AI_PROVIDER=openai)
 *   - Anthropic (AI_PROVIDER=anthropic)
 *   - Console stub (default)
 *
 * Environment variables:
 *   AI_PROVIDER          – "openai" | "anthropic" (default: "stub")
 *   OPENAI_API_KEY       – OpenAI API key
 *   OPENAI_MODEL         – Default model (default: "gpt-4o-mini")
 *   ANTHROPIC_API_KEY    – Anthropic API key
 *   ANTHROPIC_MODEL      – Default model (default: "claude-3-haiku-20240307")
 */

import type { AiProvider, CompletionParams, CompletionResult, ProviderConfig } from "../types";

export interface AiConfig extends ProviderConfig {
  apiKey: string;
  defaultModel: string;
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────

class OpenAiProvider implements AiProvider {
  readonly id = "openai";
  readonly name = "OpenAI";

  get config(): AiConfig {
    return {
      enabled: !!process.env.OPENAI_API_KEY,
      apiKey: process.env.OPENAI_API_KEY ?? "",
      defaultModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    };
  }

  isAvailable(): boolean { return !!this.config.apiKey; }

  async complete(params: CompletionParams): Promise<CompletionResult> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.config.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model ?? this.config.defaultModel,
        max_tokens: params.maxTokens ?? 1024,
        temperature: params.temperature ?? 0.7,
        messages: [
          ...(params.systemPrompt ? [{ role: "system", content: params.systemPrompt }] : []),
          { role: "user", content: params.prompt },
        ],
      }),
    });

    const json = (await res.json()) as {
      choices: Array<{ message: { content: string } }>;
      model: string;
      usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    };

    return {
      text: json.choices[0]?.message.content ?? "",
      model: json.model,
      usage: {
        promptTokens: json.usage.prompt_tokens,
        completionTokens: json.usage.completion_tokens,
        totalTokens: json.usage.total_tokens,
      },
    };
  }

  async embed(text: string): Promise<number[]> {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.config.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "text-embedding-3-small", input: text }),
    });
    const json = (await res.json()) as { data: Array<{ embedding: number[] }> };
    return json.data[0]?.embedding ?? [];
  }
}

// ─── Anthropic ────────────────────────────────────────────────────────────────

class AnthropicProvider implements AiProvider {
  readonly id = "anthropic";
  readonly name = "Anthropic";

  get config(): AiConfig {
    return {
      enabled: !!process.env.ANTHROPIC_API_KEY,
      apiKey: process.env.ANTHROPIC_API_KEY ?? "",
      defaultModel: process.env.ANTHROPIC_MODEL ?? "claude-3-haiku-20240307",
    };
  }

  isAvailable(): boolean { return !!this.config.apiKey; }

  async complete(params: CompletionParams): Promise<CompletionResult> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model ?? this.config.defaultModel,
        max_tokens: params.maxTokens ?? 1024,
        ...(params.systemPrompt ? { system: params.systemPrompt } : {}),
        messages: [{ role: "user", content: params.prompt }],
      }),
    });

    const json = (await res.json()) as {
      content: Array<{ text: string }>;
      model: string;
      usage: { input_tokens: number; output_tokens: number };
    };

    return {
      text: json.content[0]?.text ?? "",
      model: json.model,
      usage: {
        promptTokens: json.usage.input_tokens,
        completionTokens: json.usage.output_tokens,
        totalTokens: json.usage.input_tokens + json.usage.output_tokens,
      },
    };
  }

  async embed(_text: string): Promise<number[]> {
    // Anthropic does not currently have a standalone embedding API; use OpenAI for embeddings.
    return [];
  }
}

// ─── Stub ──────────────────────────────────────────────────────────────────────

class StubAiProvider implements AiProvider {
  readonly id = "stub";
  readonly name = "AI Stub";
  readonly config: AiConfig = { enabled: true, apiKey: "", defaultModel: "stub" };
  isAvailable(): boolean { return true; }

  async complete(params: CompletionParams): Promise<CompletionResult> {
    return { text: `[AI stub] Echo: ${params.prompt}`, model: "stub" };
  }

  async embed(_text: string): Promise<number[]> { return []; }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

function createAiProvider(): AiProvider {
  switch (process.env.AI_PROVIDER) {
    case "openai": return new OpenAiProvider();
    case "anthropic": return new AnthropicProvider();
    default: return new StubAiProvider();
  }
}

export const aiProvider: AiProvider = createAiProvider();
