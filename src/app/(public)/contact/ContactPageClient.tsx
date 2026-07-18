"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const cards = [
  { titleKey: "contact.card1.title", descriptionKey: "contact.card1.description", email: "info@edunancial.com" },
  { titleKey: "contact.card2.title", descriptionKey: "contact.card2.description", email: "support@edunancial.com" },
] as const;

export default function ContactPageClient() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{t("contact.label")}</p>
        <h1 className="mt-6 text-5xl font-black md:text-6xl">{t("contact.heading")}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{t("contact.intro")}</p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {cards.map((item) => (
            <div key={item.email} className="rounded-2xl border border-white/10 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-black">{t(item.titleKey)}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{t(item.descriptionKey)}</p>
              <a
                href={`mailto:${item.email}`}
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                {item.email}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-6 text-sm leading-7 text-yellow-50">
          {t("contact.banner")}
        </div>
      </section>
    </main>
  );
}
