"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function FAQPageClient() {
  const { t } = useInternationalPreferences();
  const faqs = [1, 2, 3, 4, 5, 6].map((index) => ({
    question: t(`faq.q${index}.question`),
    answer: t(`faq.q${index}.answer`),
  }));

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">{t("faq.label")}</p>
        <h1 className="mt-6 text-5xl font-black md:text-6xl">{t("faq.heading")}</h1>

        <div className="mt-20 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-xl bg-slate-900 p-8">
              <h2 className="text-2xl font-black">{faq.question}</h2>
              <p className="mt-4 leading-8 text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
