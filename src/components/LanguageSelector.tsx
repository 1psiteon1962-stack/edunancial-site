"use client";

/**
 * @deprecated Use LanguagePreferenceSelector from
 * `@/components/international/LanguagePreferenceSelector` instead.
 * This legacy component has been replaced by the global multilingual
 * architecture which uses InternationalPreferencesProvider and does not
 * require a page reload when switching languages.
 */
import LanguagePreferenceSelector from "@/components/international/LanguagePreferenceSelector";

export default function LanguageSelector() {
  return <LanguagePreferenceSelector compact />;
}
