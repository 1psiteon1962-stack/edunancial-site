"use client";

import { type ReactNode } from "react";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { normalizeLanguageCode } from "@/lib/international/languages";

export type NorthAmericaLaunchLanguage = "en" | "es" | "fr";

export function useNorthAmericaLaunchLanguage() {
  const { effectiveLanguage } = useInternationalPreferences();
  const language = normalizeLanguageCode(effectiveLanguage);

  if (language === "es") {
    return "es";
  }

  if (language === "fr-CA" || language === "fr-FR") {
    return "fr";
  }

  return "en";
}

export default function BilingualContent({
  en,
  es,
  fr,
}: {
  en: ReactNode;
  es: ReactNode;
  fr?: ReactNode;
}) {
  const language = useNorthAmericaLaunchLanguage();

  if (language === "es") {
    return <>{es}</>;
  }

  if (language === "fr") {
    return <>{fr ?? en}</>;
  }

  return <>{en}</>;
}
