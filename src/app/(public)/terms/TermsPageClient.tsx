"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const lastUpdated = "July 12, 2026";

function TermsSection({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h2 className="text-3xl font-black text-white">{title}</h2>
      <p className="mt-4 leading-8">{body}</p>
    </section>
  );
}

export default function TermsPageClient() {
  const { t } = useInternationalPreferences();
  const sections = [1, 2, 3, 4, 5, 6, 7, 8].map((index) => ({
    title: t(`terms.section${index}.title`),
    body: t(`terms.section${index}.body`),
  }));

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{t("terms.label")}</p>
        <h1 className="mt-4 text-5xl font-black">{t("terms.title")}</h1>
        <p className="mt-4 text-slate-400">{t("terms.updatedLabel")}: {lastUpdated}</p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
          <p>{t("branding.identity")}</p>
          <p className="mt-4">{t("branding.publicDisclaimer")}</p>
          <p className="mt-4">{t("branding.methodsClarification")}</p>
        </div>

        <div className="mt-10 space-y-10 text-slate-300">
          {sections.map((section) => (
            <TermsSection key={section.title} title={section.title} body={section.body} />
          ))}
          <section>
            <h2 className="text-3xl font-black text-white">{t("terms.contactTitle")}</h2>
            <p className="mt-4 leading-8">
              {t("terms.contactLead")} {" "}
              <Link href="/contact" className="text-blue-300 underline">
                {t("terms.contactLink")}
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
