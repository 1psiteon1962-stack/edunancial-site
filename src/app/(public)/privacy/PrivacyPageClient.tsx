"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const lastUpdated = "August 24, 2026";

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

        <div className="mt-10 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-6 text-slate-200">
          <h2 className="text-2xl font-black text-white">Persons Below the Age of Majority</h2>
          <p className="mt-3 leading-7">
            Parent or legal guardian consent is mandatory for every Edunancial user who has not reached
            the legal age of majority in the jurisdiction where that user resides. The parent or legal
            guardian must authorize the account and the minor&apos;s use of Edunancial and must provide any
            consent required for Edunancial to collect, use, retain, or disclose the minor&apos;s personal
            information under applicable law. Edunancial may require reasonable verification of age,
            identity, relationship, or consent and may restrict an account until required consent is
            verified.
          </p>
          <p className="mt-3 leading-7">
            A parent or legal guardian may contact privacy@edunancial.com regarding a minor&apos;s account,
            consent, access, correction, deletion, or other privacy rights. Where applicable law provides
            additional protections for children or minors, those non-waivable protections control.
          </p>
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
