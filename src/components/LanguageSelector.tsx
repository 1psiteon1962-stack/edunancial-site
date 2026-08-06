"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { LANGUAGE_CATALOG } from "@/lib/international/languages";

/**
 * Legacy LanguageSelector — delegates to the canonical InternationalPreferencesProvider
 * so language switching is instant (no page reload) and stays consistent with the
 * LanguagePreferenceSelector used in the main Navbar.
 */
export default function LanguageSelector() {
  const { effectiveLanguage, setLanguage } = useInternationalPreferences();

  return (
    <select
      value={effectiveLanguage}
      onChange={(e) => setLanguage(e.target.value)}
      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
    >
      {LANGUAGE_CATALOG.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeLabel ?? lang.label}
        </option>
      ))}
    </select>
  );
}

