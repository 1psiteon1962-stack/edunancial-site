"use client";

import { type ReactNode } from "react";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { normalizeLanguageCode } from "@/lib/international/languages";

export function useNorthAmericaLaunchLanguage() {
  const { effectiveLanguage } = useInternationalPreferences();

  return normalizeLanguageCode(effectiveLanguage) === "es" ? "es" : "en";
}

export default function BilingualContent({
  en,
  es,
}: {
  en: ReactNode;
  es: ReactNode;
}) {
  const language = useNorthAmericaLaunchLanguage();

  return <>{language === "es" ? es : en}</>;
}
