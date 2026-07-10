import { languages } from "@/lib/i18n/languages";

type HreflangTagsProps = {
  currentLocale: string;
  pageSlug: string;
  supportedLocales?: string[];
};

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.edunancial.com";

function normalizeSlug(pageSlug: string): string {
  if (!pageSlug || pageSlug === "/") {
    return "";
  }

  const trimmed = pageSlug.replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

export default function HreflangTags({
  currentLocale,
  pageSlug,
  supportedLocales = [...languages],
}: HreflangTagsProps) {
  const slug = normalizeSlug(pageSlug);
  const canonicalUrl = `${baseUrl}${slug}`;

  return (
    <>
      {supportedLocales.map((locale) => {
        const href = `${baseUrl}/${locale}${slug}`;
        return (
          <link
            key={`${locale}-${currentLocale}`}
            rel="alternate"
            hrefLang={locale}
            href={href}
          />
        );
      })}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </>
  );
}
