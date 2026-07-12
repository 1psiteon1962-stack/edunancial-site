const ACTIVE_LOCALES = [
  "en",
  "es",
  "fr",
  "pt",
  "ar",
  "sw",
  "ja",
  "ko",
  "zh-Hans",
  "de",
  "it",
  "nl",
  "hi",
  "zh-Hant",
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
  "/canada",
  "/canada/courses",
  "/canada/membership",
  "/legal/pipeda",
  "/europe",
  "/western-europe",
  "/eastern-europe",
] as const;

export default function sitemap() {
  const lastModified = new Date();

  const canonicalEntries = PUBLIC_PATHS.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
  }));

  const localizedEntries = PUBLIC_PATHS.flatMap((path) =>
    ACTIVE_LOCALES.filter((locale) => locale !== "en").map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified,
    }))
  );

  return [...canonicalEntries, ...localizedEntries];
}
