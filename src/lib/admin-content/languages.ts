import { getLanguageByCode, normalizeLanguageCode } from "@/lib/international/languages";

/**
 * Admin curriculum intake accepts canonical locale variants plus legacy base
 * language tags used by existing curriculum packages. Labels and canonical
 * normalization come from the global language registry so the uploader cannot
 * drift from the international architecture.
 */
export const ADMIN_CONTENT_LANGUAGES = [
  "en",
  "en-US",
  "en-GB",
  "es",
  "es-Caribbean",
  "es-ES",
  "fr",
  "fr-CA",
  "fr-FR",
  "pt",
  "pt-BR",
  "pt-PT",
  "de",
  "it",
  "nl",
] as const;

export type AdminContentLanguage = (typeof ADMIN_CONTENT_LANGUAGES)[number];

const LEGACY_BASE_LABELS: Partial<Record<AdminContentLanguage, string>> = {
  en: "English",
  fr: "French",
  pt: "Portuguese",
};

export const ADMIN_CONTENT_LANGUAGE_LABELS = Object.fromEntries(
  ADMIN_CONTENT_LANGUAGES.map((code) => [
    code,
    LEGACY_BASE_LABELS[code] ?? getLanguageByCode(code)?.label ?? code,
  ]),
) as Record<AdminContentLanguage, string>;

export function canonicalAdminContentLanguage(language: string): AdminContentLanguage {
  const canonical = normalizeLanguageCode(language);
  if ((ADMIN_CONTENT_LANGUAGES as readonly string[]).includes(canonical)) {
    return canonical as AdminContentLanguage;
  }
  return "en-US";
}
