"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage, Conversation, MemberContext } from "@/lib/ai-tutor/types";
import { sendAITutorMessage } from "@/lib/ai-tutor/service";

interface Props {
  initialContext: MemberContext;
  onQuestionSelected?: (q: string) => void;
  externalMessage?: string;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createConversation(): Conversation {
  return {
    id: generateId(),
    title: "New Conversation",
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Simple markdown-to-JSX: bold, inline code, tables (basic), blockquote
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let isHeader = false;

  const flushTable = () => {
    if (tableRows.length === 0) return;
    const [header, , ...body] = tableRows;
    result.push(
      <div key={`table-${result.length}`} className="my-3 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {(header ?? []).map((cell, i) => (
                <th
                  key={i}
                  className="border border-slate-600 bg-slate-800 px-3 py-1.5 text-left font-semibold text-slate-200"
                >
                  {cell.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="border border-slate-700 px-3 py-1.5 text-slate-300"
                  >
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    isHeader = false;
    inTable = false;
  };

  lines.forEach((line, idx) => {
    // Table detection
    if (line.startsWith("|")) {
      inTable = true;
      const cells = line.split("|").filter((_, i, arr) => i > 0 && i < arr.length - 1);
      // separator row
      if (cells.every((c) => /^[\s\-:]+$/.test(c))) {
        isHeader = true;
        tableRows.push(cells); // push separator
      } else {
        tableRows.push(cells);
      }
      void isHeader;
      return;
    } else if (inTable) {
      flushTable();
    }

    // Blockquote
    if (line.startsWith("> ")) {
      result.push(
        <blockquote
          key={idx}
          className="my-2 border-l-4 border-yellow-500 pl-4 text-slate-300 italic"
        >
          {inlineFormat(line.slice(2))}
        </blockquote>
      );
      return;
    }

    // Code block (fenced) — simplified: treat ``` lines as dividers
    if (line.startsWith("```")) {
      return; // handled below with multi-line logic; skip for now
    }

    // Numbered list
    const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
    if (numberedMatch) {
      result.push(
        <p key={idx} className="my-0.5 flex gap-2 text-slate-300">
          <span className="shrink-0 font-semibold text-yellow-400">{numberedMatch[1]}.</span>
          <span>{inlineFormat(numberedMatch[2])}</span>
        </p>
      );
      return;
    }

    // Unordered list
    if (line.startsWith("- ") || line.startsWith("• ")) {
      result.push(
        <p key={idx} className="my-0.5 flex gap-2 text-slate-300">
          <span className="shrink-0 text-yellow-400">•</span>
          <span>{inlineFormat(line.slice(2))}</span>
        </p>
      );
      return;
    }

    // Empty line
    if (line.trim() === "") {
      result.push(<div key={idx} className="h-2" />);
      return;
    }

    // Normal paragraph
    result.push(
      <p key={idx} className="text-slate-300 leading-relaxed">
        {inlineFormat(line)}
      </p>
    );
  });

  if (inTable) flushTable();

  return result;
}

function inlineFormat(text: string): React.ReactNode {
  // **bold**, *italic*, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-slate-700 px-1.5 py-0.5 font-mono text-xs text-yellow-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// ─── Search modal ──────────────────────────────────────────────────────────────

interface SearchModalProps {
  conversations: Conversation[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

function SearchModal({ conversations, onSelect, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const filtered = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.messages.some((m) =>
        m.content.toLowerCase().includes(query.toLowerCase())
      )
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search conversations"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-slate-900 p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          type="search"
          placeholder="Search conversations…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto">
          {filtered.length === 0 && (
            <li className="px-2 py-3 text-sm text-slate-500">No results found.</li>
          )}
          {filtered.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => { onSelect(c.id); onClose(); }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                <span className="font-medium text-white">{c.title}</span>
                <span className="ml-2 text-xs text-slate-500">
                  {c.messages.length} message{c.messages.length !== 1 ? "s" : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Main Chat Component ──────────────────────────────────────────────────────

export default function AIChatInterface({ initialContext, externalMessage }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([
    createConversation(),
  ]);
  const [activeId, setActiveId] = useState<string>(conversations[0].id);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeId)!;

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      // Optimistically add user message
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                title: c.messages.length === 0 ? trimmed.slice(0, 50) : c.title,
                messages: [...c.messages, userMsg],
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
      setInput("");
      setIsLoading(true);

      try {
        const response = await sendAITutorMessage({
          message: trimmed,
          conversationHistory: activeConversation.messages,
          memberContext: initialContext,
        });

        const assistantMsg: ChatMessage = {
          id: response.messageId,
          role: "assistant",
          content: response.content,
          timestamp: new Date().toISOString(),
          citations: response.citations,
          suggestedResources: response.suggestedResources,
          guardrailCategory: response.guardrailCategory,
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  messages: [...c.messages, assistantMsg],
                  updatedAt: new Date().toISOString(),
                }
              : c
          )
        );
      } catch {
        const errMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        };
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? { ...c, messages: [...c.messages, errMsg] }
              : c
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeId, activeConversation, initialContext, isLoading]
  );

  // Accept externally injected question (from SuggestedQuestions)
  useEffect(() => {
    if (externalMessage) {
      sendMessage(externalMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalMessage]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages.length, isLoading]);

  function newConversation() {
    const conv = createConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setShowSidebar(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex h-full min-h-[600px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
      {/* ─── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside
        id="chat-sidebar"
        aria-label="Conversation history"
        className={`${
          showSidebar ? "flex" : "hidden"
        } w-64 shrink-0 flex-col border-r border-slate-700 bg-slate-950 lg:flex`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Conversations
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSearch(true)}
              className="rounded p-1 text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label="Search conversations"
              title="Search"
            >
              🔍
            </button>
            <button
              onClick={newConversation}
              className="rounded p-1 text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label="New conversation"
              title="New conversation"
            >
              ✏️
            </button>
          </div>
        </div>

        <nav aria-label="Conversation list" className="flex-1 overflow-y-auto px-2 pb-4">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => { setActiveId(c.id); setShowSidebar(false); }}
              className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                c.id === activeId
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
              aria-current={c.id === activeId ? "true" : undefined}
            >
              <span className="block truncate font-medium">{c.title || "New Conversation"}</span>
              <span className="text-xs text-slate-600">
                {c.messages.length} message{c.messages.length !== 1 ? "s" : ""}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ─── Chat Area ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header */}
        <header className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar((s) => !s)}
              className="lg:hidden rounded p-1 text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label="Toggle conversation history"
              aria-expanded={showSidebar}
              aria-controls="chat-sidebar"
            >
              ☰
            </button>
            <div>
              <h1 className="text-sm font-bold text-white">
                {activeConversation?.title || "AI Financial Tutor"}
              </h1>
              <p className="text-xs text-slate-500">Educational AI · Not financial advice</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(true)}
              className="hidden rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 sm:block"
              aria-label="Search conversations"
            >
              Search
            </button>
            <button
              onClick={newConversation}
              className="rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label="Start new conversation"
            >
              New Chat
            </button>
          </div>
        </header>

        {/* Messages */}
        <main
          aria-label="Chat messages"
          aria-live="polite"
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
        >
          {activeConversation?.messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="mb-4 text-5xl"
                role="img"
                aria-label="AI Tutor"
              >
                🎓
              </div>
              <h2 className="text-xl font-bold text-white">
                Hello, {initialContext.profile.displayName}!
              </h2>
              <p className="mt-2 max-w-sm text-sm text-slate-400">
                I&apos;m your Edunancial AI Tutor. Ask me anything about
                financial literacy, investing, budgeting, or your learning
                journey.
              </p>
              <p className="mt-3 text-xs text-slate-600">
                I provide education — not personalized financial advice.
              </p>
            </div>
          )}

          {activeConversation?.messages.map((msg) => (
            <article
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              aria-label={`${msg.role === "user" ? "You" : "AI Tutor"} said`}
            >
              {/* Avatar */}
              <div
                aria-hidden="true"
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                  msg.role === "user"
                    ? "bg-yellow-500 text-slate-900 font-bold"
                    : "bg-blue-700 text-white"
                }`}
              >
                {msg.role === "user"
                  ? initialContext.profile.displayName.charAt(0).toUpperCase()
                  : "🎓"}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-yellow-500 text-slate-900"
                    : "rounded-tl-sm bg-slate-800 text-white"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="text-sm font-medium">{msg.content}</p>
                ) : (
                  <div className="text-sm space-y-1">
                    {renderMarkdown(msg.content)}
                  </div>
                )}

                {/* Guardrail badge */}
                {msg.guardrailCategory &&
                  msg.guardrailCategory !== "educational" && (
                    <p className="mt-2 text-xs text-slate-500">
                      ⚠️ Educational mode ·{" "}
                      {msg.guardrailCategory.replace(/_/g, " ")}
                    </p>
                  )}
              </div>
            </article>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <article
              className="flex gap-3"
              aria-label="AI Tutor is typing"
              aria-live="assertive"
            >
              <div
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm text-white"
              >
                🎓
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-3">
                <span className="sr-only">Thinking…</span>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </article>
          )}

          <div ref={bottomRef} />
        </main>

        {/* Input area */}
        <footer className="border-t border-slate-700 p-4">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex gap-3"
            aria-label="Send a message"
          >
            <label htmlFor="chat-input" className="sr-only">
              Ask a financial education question
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a financial education question… (Enter to send)"
              rows={2}
              disabled={isLoading}
              className="flex-1 resize-none rounded-xl bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
              aria-label="Message input"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="self-end rounded-xl bg-yellow-500 px-4 py-3 font-bold text-slate-900 transition hover:bg-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              Send
            </button>
          </form>
          <p className="mt-2 text-center text-xs text-slate-600">
            Edunancial AI provides financial education, not personalized
            financial, legal, or tax advice.
          </p>
        </footer>
      </div>

      {/* Search modal */}
      {showSearch && (
        <SearchModal
          conversations={conversations}
          onSelect={setActiveId}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  );
}
