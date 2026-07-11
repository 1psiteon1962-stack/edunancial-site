import type { Metadata } from "next";
import AIChatClient from "@/components/ai/AIChatClient";

export const metadata: Metadata = {
  title: "AI Chat | Edunancial",
  description:
    "Chat with the Edunancial AI to get financial education guidance, course recommendations, and competency insights.",
  robots: { index: true, follow: true },
};

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI Chat Assistant
        </p>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          Financial Education Chat
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Ask questions, explore learning paths, and get guidance on building
          your financial competency.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Educational guidance only — not personalized financial, legal, or tax advice.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <AIChatClient region="us" locale="en" />
      </section>
    </main>
  );
}
