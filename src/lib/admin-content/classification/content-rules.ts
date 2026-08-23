import type { SupportedLanguage } from "@/lib/admin-content/types";

// Content heuristics intentionally remain conservative. Exact curriculum locale
// (for example pt-BR vs pt-PT, en-US vs en-GB) comes from explicit upload
// metadata and/or the locale suffix in the lesson filename. Broad content
// detection must not guess a regional locale from short lesson text.
const LANGUAGE_HEURISTICS: Partial<Record<SupportedLanguage, RegExp[]>> = {
  en: [/\b(the|and|lesson|course|financial|business)\b/i],
  es: [/\b(el|curso|leccion|finanzas|bienes|raices|inversionistas)\b/i],
  fr: [/\b(le|les|des|cours|lecon|finance|politique|confidentialite)\b/i],
  "fr-CA": [/\b(bonjour|quebec|canadien|canadienne|canada)\b/i],
};

export function detectLanguage(text: string): SupportedLanguage {
  for (const language of ["fr-CA", "es", "fr", "en"] as const) {
    if (LANGUAGE_HEURISTICS[language]?.some((pattern) => pattern.test(text))) {
      return language;
    }
  }
  return "en";
}

export function classifyFromContent(text: string) {
  const lowered = text.toLowerCase();
  const reasons: string[] = [];
  if (lowered.includes("learning objectives") || lowered.includes("core content")) {
    reasons.push("content matches curriculum lesson structure");
  }
  if (lowered.includes("privacy") || lowered.includes("terms and conditions")) {
    reasons.push("content includes legal language");
  }
  return reasons;
}
