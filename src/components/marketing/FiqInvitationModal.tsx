"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { getStoredLanguageAdminSettings, LANGUAGE_CATALOG, normalizeLanguageCode } from "@/lib/international/languages";

const SESSION_KEY = "edunancial-fiq-invitation-seen";

export default function FiqInvitationModal() {
  const pathname = usePathname();
  const { effectiveLanguage, setLanguage } = useInternationalPreferences();
  const [open, setOpen] = useState(false);
  const [fiqLanguage, setFiqLanguage] = useState(normalizeLanguageCode(effectiveLanguage));
  const enabledLanguages = useMemo(() => {
    const settings = getStoredLanguageAdminSettings();
    return LANGUAGE_CATALOG.filter((language) => settings.enabledLanguages.includes(language.code));
  }, []);

  useEffect(() => {
    setFiqLanguage(normalizeLanguageCode(effectiveLanguage));
  }, [effectiveLanguage]);

  useEffect(() => {
    if (pathname !== "/") {
      setOpen(false);
      return;
    }
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) !== "1") {
        const timer = window.setTimeout(() => setOpen(true), 450);
        return () => window.clearTimeout(timer);
      }
    } catch {
      const timer = window.setTimeout(() => setOpen(true), 450);
      return () => window.clearTimeout(timer);
    }
  }, [pathname]);

  function markSeen() {
    try { window.sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
  }

  function decline() {
    markSeen();
    setOpen(false);
  }

  function chooseFiqLanguage(value: string) {
    const normalized = normalizeLanguageCode(value);
    setFiqLanguage(normalized);
    setLanguage(normalized);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="fiq-invitation-title" aria-describedby="fiq-invitation-description">
      <div className="w-full max-w-xl rounded-3xl border border-yellow-300/30 bg-[#0b1428] p-6 shadow-2xl shadow-black/50 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-yellow-300">Free Financial Intelligence Quiz</p>
        <h2 id="fiq-invitation-title" className="mt-4 text-3xl font-black text-white sm:text-4xl">Want to take the free Edunancial FIQ?</h2>
        <p id="fiq-invitation-description" className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
          The Edunancial Financial Intelligence Quiz (Edunancial FIQ) helps you measure your current financial knowledge and identify areas to strengthen. It is for educational, informational, and/or recreational purposes only and does not provide financial, legal, tax, investment, or other professional advice.
        </p>

        <label htmlFor="fiq-language" className="mt-6 block text-sm font-bold text-white">What language would you like to use for the FIQ?</label>
        <select id="fiq-language" value={fiqLanguage} onChange={(event) => chooseFiqLanguage(event.target.value)} className="mt-2 w-full rounded-xl border border-white/20 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-300">
          {enabledLanguages.map((language) => <option key={language.code} value={language.code}>{language.nativeLabel}</option>)}
        </select>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href={`/assessment?lang=${encodeURIComponent(fiqLanguage)}`} onClick={markSeen} className="inline-flex min-h-14 items-center justify-center rounded-xl bg-yellow-400 px-5 py-4 text-center text-base font-black text-slate-950 transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200">
            Yes — Take the Free FIQ
          </Link>
          <button type="button" onClick={decline} className="min-h-14 rounded-xl border border-white/20 bg-white/5 px-5 py-4 text-base font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">No — Explore the Website</button>
        </div>
      </div>
    </div>
  );
}
