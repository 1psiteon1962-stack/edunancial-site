"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function FAQPageClient() {
  const { t } = useInternationalPreferences();
  const faqs = Array.from({ length: 8 }, (_, offset) => offset + 1).map((index) => ({
    question: t(`faq.q${index}.question`),
    answer: t(`faq.q${index}.answer`),
  }));

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">{t("faq.label")}</p>
        <h1 className="mt-6 text-5xl font-black md:text-6xl">{t("faq.heading")}</h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">{t("faq.intro")}</p>

        <div className="mt-16 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-xl border border-white/10 bg-slate-900 p-8">
              <h2 className="text-2xl font-black">{faq.question}</h2>
              <p className="mt-4 leading-8 text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
          {t("branding.publicDisclaimer")}
        </p>
      </section>
    </main>
  );
}
