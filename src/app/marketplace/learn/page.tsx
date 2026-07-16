import type { Metadata } from "next";

import LearnSection from "@/components/marketplace/LearnSection";

export const metadata: Metadata = {
  title: "Learn | Edunancial Marketplace",
  description:
    "Educational products from Edunancial — books, eBooks, courses, certifications, templates, workbooks, and more. Organized by RED (Real Estate), WHITE (Paper Assets), and BLUE (Business).",
};

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-blue-400">
          Marketplace › Learn
        </p>
        <h1 className="text-5xl font-black md:text-6xl">
          Learn. Apply. Build.
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-300">
          Financial literacy provides the foundation. Financial competency is
          built through disciplined action. Every product in this section is
          designed to move you from knowledge to confident application.
        </p>

        <div className="mt-16">
          <LearnSection />
        </div>
      </section>
    </main>
  );
}
