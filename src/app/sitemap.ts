// Locale-aware sitemap — includes hreflang alternates for supported languages.
// Supported UI languages with active locale files.
const ACTIVE_LOCALES = [
  "en", "es", "fr", "pt", "ar", "sw",
  "ja", "ko", "zh-Hans",
  "de", "it", "nl",
  "hi", "zh-Hant",
  "ht",
] as const;

const BASE_URL = "https://www.edunancial.com";

const PUBLIC_PATHS = [
  "",
  "/about",
  "/courses",
  "/membership",
  "/levels",
  "/sponsor",
  "/contact",
  "/privacy",
  "/trust-center",
  "/security",
  "/disclaimer",
  "/terms",
  "/refund-policy",
  "/faq",
  "/assessment",
  "/why-edunancial",
] as const;

export default function sitemap() {
  const lastModified = new Date();

  // Canonical (en) entries — one per public path
  const canonical = PUBLIC_PATHS.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
  }));

  // Locale-prefixed alternate entries — one per locale × path
  // These allow search engines to index translated pages and avoid duplicate-indexing.
  const localeEntries = PUBLIC_PATHS.flatMap((path) =>
    ACTIVE_LOCALES.filter((locale) => locale !== "en").map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified,
    }))
  );

  return [...canonical, ...localeEntries];
}
