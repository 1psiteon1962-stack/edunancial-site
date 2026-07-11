import type { Metadata } from "next";
import AIChatClient from "@/components/ai/AIChatClient";

export const metadata: Metadata = {
  title: "AI Financial Coach | Edunancial",
  description:
    "Get personalized financial education guidance from the Edunancial AI Coach. Ask about real estate, paper assets, business, and your financial competency journey.",
  robots: { index: true, follow: true },
};

export default function AIPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI Financial Coach
        </p>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          Your Personal Financial Coach
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Ask about real estate, paper assets, business, or your financial
          competency journey. Powered by Edunancial&rsquo;s educational AI.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Educational guidance only — not personalized financial, legal, or tax
          advice.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <AIChatClient region="us" locale="en" />
      </section>
    </main>
  );
}
