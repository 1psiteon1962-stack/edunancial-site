"use client";

import Link from "next/link";
import { useState } from "react";

interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function getMockResponse(message: string): string {
  const normalizedMessage = message.toLowerCase();

  // TODO: Replace mockResponse with real AI API call (OpenAI, Anthropic, etc.)
  if (normalizedMessage.includes("billing")) {
    return "It sounds like this is a billing question — check out our Billing Support articles or view your billing history.";
  }

  if (normalizedMessage.includes("course")) {
    return "It sounds like you need course help — take a look at our Course Assistance articles for enrollment, progress, and certificate guidance.";
  }

  return "I can help point you in the right direction. Try the Help Center for quick answers, or open a support ticket if you want a human teammate to review this with you.";
}

export default function AISupportAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: "assistant",
      content: "Hi! I’m the Edunancial support assistant. Ask about billing, courses, or account help.",
      timestamp: new Date(),
    },
  ]);

  const handleSend = () => {
    const content = input.trim();

    if (!content) {
      return;
    }

    const userMessage: AIMessage = {
      role: "user",
      content,
      timestamp: new Date(),
    };

    const assistantMessage: AIMessage = {
      role: "assistant",
      content: getMockResponse(content),
      timestamp: new Date(),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen ? (
        <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-white/10 shadow-2xl">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white">Support Assistant</h2>
                <p className="mt-1 text-xs text-blue-400">Powered by AI (coming soon)</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close support chat assistant"
                className="rounded-full border border-white/10 px-3 py-2 text-slate-300 hover:border-blue-500 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="max-h-80 space-y-4 overflow-y-auto p-5">
            {messages.map((message, index) => {
              const isAssistant = message.role === "assistant";

              return (
                <div
                  key={`${message.timestamp.toISOString()}-${index}`}
                  className={`rounded-xl p-4 text-sm ${
                    isAssistant
                      ? "bg-[#101a2f] text-slate-200"
                      : "ml-8 bg-blue-600 text-white"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`mt-2 text-xs ${isAssistant ? "text-slate-400" : "text-blue-100"}`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/10 p-5">
            <label htmlFor="ai-support-message" className="text-sm font-bold text-slate-300 mb-2 block">
              Ask a question
            </label>
            <div className="flex gap-3">
              <input
                id="ai-support-message"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:border-blue-500 focus:outline-none w-full"
                placeholder="Ask about billing, courses, or support"
              />
              <button
                type="button"
                onClick={handleSend}
                className="rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500"
              >
                Send
              </button>
            </div>
            <Link
              href="/support/new"
              className="mt-4 inline-flex rounded-lg border border-white/10 px-5 py-3 font-bold hover:border-blue-500"
            >
              Talk to a human
            </Link>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((currentState) => !currentState)}
        aria-label="Open support chat assistant"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg hover:bg-blue-500"
      >
        💬
      </button>
    </div>
  );
}
