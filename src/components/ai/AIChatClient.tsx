"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { AIRegion, AILocale, AIChatMessage } from "@/lib/ai/types";
import { buildWelcomeMessage } from "@/lib/ai/prompts";

interface AIChatClientProps {
  region?: AIRegion;
  locale?: AILocale;
}

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  error?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "What is the difference between financial literacy and financial competency?",
  "How do I start investing in real estate with limited capital?",
  "Explain the RED, WHITE, and BLUE learning paths.",
  "What is a Financial Competency Score?",
  "How do I build business cash flow?",
];

export default function AIChatClient({
  region = "us",
  locale = "en",
}: AIChatClientProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: buildWelcomeMessage(region, locale),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(
    undefined
  );
  const [retryPayload, setRetryPayload] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Collect conversation history in the format the API expects */
  function buildHistory(): AIChatMessage[] {
    return messages
      .filter((m) => !m.error && !m.streaming)
      .map((m) => ({ role: m.role, content: m.content }));
  }

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setRetryPayload(null);
      setInput("");

      const userMsgId = crypto.randomUUID();
      const assistantMsgId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: trimmed },
        { id: assistantMsgId, role: "assistant", content: "", streaming: true },
      ]);
      setLoading(true);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            message: trimmed,
            conversationId,
            history: buildHistory(),
            region,
            locale,
            stream: true,
          }),
        });

        if (response.status === 429) {
          const data = (await response.json()) as { message?: string };
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: data.message ?? "Too many requests. Please wait a moment.",
                    streaming: false,
                    error: true,
                  }
                : m
            )
          );
          setRetryPayload(trimmed);
          return;
        }

        if (!response.ok || !response.body) {
          throw new Error("Network error");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith("data: ")) continue;
            const dataStr = trimmedLine.slice(6);
            try {
              const chunk = JSON.parse(dataStr) as {
                type: string;
                delta?: string;
                conversationId?: string;
                message?: string;
              };

              if (chunk.type === "start" && chunk.conversationId) {
                setConversationId(chunk.conversationId);
              } else if (chunk.type === "delta" && chunk.delta) {
                accumulated += chunk.delta;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: accumulated }
                      : m
                  )
                );
              } else if (chunk.type === "done") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, streaming: false }
                      : m
                  )
                );
              } else if (chunk.type === "error") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content:
                            chunk.message ??
                            "Something went wrong. Please try again.",
                          streaming: false,
                          error: true,
                        }
                      : m
                  )
                );
                setRetryPayload(trimmed);
              }
            } catch {
              // malformed SSE chunk — skip
            }
          }
        }
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: "Connection error. Please check your connection and try again.",
                  streaming: false,
                  error: true,
                }
              : m
          )
        );
        setRetryPayload(trimmed);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, conversationId, region, locale, messages]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-slate-900">
      {/* Message area */}
      <div
        className="flex flex-col gap-4 overflow-y-auto p-6"
        style={{ minHeight: "400px", maxHeight: "600px" }}
        role="log"
        aria-label="Conversation"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.role === "user"
                ? "ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-blue-600 px-5 py-3 text-sm leading-relaxed"
                : "mr-auto max-w-[80%] rounded-2xl rounded-bl-sm bg-slate-800 px-5 py-3 text-sm leading-relaxed " +
                  (msg.error ? "border border-red-500/50 text-red-300" : "text-slate-100")
            }
          >
            {msg.content || (msg.streaming ? null : "…")}
            {msg.streaming && (
              <span
                aria-hidden="true"
                className="ml-1 inline-block h-3 w-0.5 animate-pulse bg-blue-400"
              />
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions (shown only at the start) */}
      {messages.length <= 2 && (
        <div className="border-t border-white/10 px-6 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Suggested questions
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => void sendMessage(q)}
                disabled={loading}
                className="rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Retry banner */}
      {retryPayload && !loading && (
        <div className="flex items-center gap-3 border-t border-white/10 bg-red-950/30 px-6 py-3 text-sm text-red-300">
          <span>Something went wrong.</span>
          <button
            onClick={() => void sendMessage(retryPayload)}
            className="rounded-lg border border-red-400/40 px-3 py-1 text-xs font-bold text-red-300 hover:bg-red-900/50"
          >
            Retry
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-3">
          <label htmlFor="ai-chat-input" className="sr-only">
            Message the AI Financial Coach
          </label>
          <textarea
            id="ai-chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about real estate, paper assets, business, or your financial journey…"
            rows={2}
            disabled={loading}
            maxLength={2000}
            aria-label="Message"
            className="flex-1 resize-none rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={() => void sendMessage(input)}
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-40"
          >
            {loading ? (
              <span aria-hidden="true" className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Send"
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-600">
          Press Enter to send · Shift+Enter for new line · Educational guidance only, not financial advice
        </p>
      </div>
    </div>
  );
}
