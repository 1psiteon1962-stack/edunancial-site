"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const FAQ_ITEMS = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
] as const;

export default function FAQClient() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">FAQ</p>
        <h1 className="mt-6 text-5xl font-black md:text-6xl">{t("faq.heading")}</h1>

        <div className="mt-20 space-y-6">
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} className="rounded-xl bg-slate-900 p-8">
              <h2 className="text-2xl font-black">{t(item.q)}</h2>
              <p className="mt-4 leading-8 text-slate-300">{t(item.a)}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
