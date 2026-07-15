"use client";

import { type ReactNode } from "react";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { normalizeLanguageCode } from "@/lib/international/languages";

export type NorthAmericaLaunchLanguage = "en" | "es" | "fr-CA" | "fr-FR";

export function useNorthAmericaLaunchLanguage(): NorthAmericaLaunchLanguage {
  const { effectiveLanguage } = useInternationalPreferences();
  const language = normalizeLanguageCode(effectiveLanguage);

  if (language === "es") {
    return "es";
  }

  if (language === "fr-CA") {
    return "fr-CA";
  }

  if (language === "fr-FR") {
    return "fr-FR";
  }

  return "en";
}

export default function BilingualContent({
  en,
  es,
  fr,
  frCA,
  frFR,
}: {
  en: ReactNode;
  es: ReactNode;
  fr?: ReactNode;
  frCA?: ReactNode;
  frFR?: ReactNode;
}) {
  const language = useNorthAmericaLaunchLanguage();

  if (language === "es") {
    return <>{es}</>;
  }

  if (language === "fr-CA") {
    return <>{frCA ?? fr ?? en}</>;
  }

  if (language === "fr-FR") {
    return <>{frFR ?? fr ?? en}</>;
  }

  return <>{en}</>;
}
