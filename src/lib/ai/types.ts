/** Core types for the Edunancial AI platform */

export type AIRegion = "us" | "ca" | "global";
export type AILocale = "en" | "es" | "fr" | "ko" | "ja" | "tl" | "ar" | "pt";

export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIChatRequest {
  message: string;
  conversationId?: string;
  history?: AIChatMessage[];
  region?: AIRegion;
  locale?: AILocale;
  userId?: string;
}

export interface AIChatResponse {
  content: string;
  conversationId: string;
  region: AIRegion;
  locale: AILocale;
  model: string;
  finishReason: "stop" | "length" | "error";
}

export interface AIStreamChunk {
  delta: string;
  done: boolean;
  conversationId?: string;
  finishReason?: "stop" | "length" | "error";
}

export interface AIProvider {
  name: string;
  available: boolean;
  streamChat(
    messages: AIChatMessage[],
    options: AIProviderOptions
  ): AsyncGenerator<string>;
  chat(
    messages: AIChatMessage[],
    options: AIProviderOptions
  ): Promise<AIChatResponse>;
}

export interface AIProviderOptions {
  region: AIRegion;
  locale: AILocale;
  conversationId: string;
  maxTokens?: number;
  temperature?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAtMs: number;
}
