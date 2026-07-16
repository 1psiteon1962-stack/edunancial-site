"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const lastUpdated = "July 9, 2026";

export default function PrivacyPageClient() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-yellow-400">{t("privacy.label")}</p>
        <h1 className="mb-4 text-5xl font-black">{t("privacy.title")}</h1>
        <p className="leading-8 text-slate-300">{t("privacy.intro")}</p>

        <div className="mt-10 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-6 text-slate-200">
          <p className="font-semibold text-blue-200">{t("privacy.notice")}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black">{t(`privacy.section${index}.title`)}</h2>
              <p className="mt-3 leading-7 text-slate-300">{t(`privacy.section${index}.body`)}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm leading-7 text-slate-300">
          <p>
            <strong>{t("privacy.identityLabel")}:</strong> {t("branding.identity")}
          </p>
          <p className="mt-4">
            <strong>{t("privacy.disclaimerLabel")}:</strong> {t("branding.publicDisclaimer")}
          </p>
          <p className="mt-4">
            privacy@edunancial.com · <strong>{t("privacy.updatedLabel")}:</strong> {lastUpdated}
          </p>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8 text-sm text-slate-500">
          <p>
            <Link href="/terms" className="underline">
              {t("footer.link.terms")}
            </Link>
            {" · "}
            <Link href="/cookies" className="underline">
              {t("footer.link.cookies")}
            </Link>
            {" · "}
            <Link href="/disclaimer" className="underline">
              {t("footer.link.disclaimer")}
            </Link>
            {" · "}
            <Link href="/trust-center" className="underline">
              {t("footer.link.trustCenter")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
