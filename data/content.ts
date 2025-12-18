import type { Locale } from "./site-config";

export type PageContent = {
  heroTitle: string;
  storyTitle: string;
  coursesTitle: string;
  appsTitle: string;
  footerNote: string;
};

const EN: PageContent = {
  heroTitle: "Where Education and Financial Literacy Meet",
  storyTitle: "Our Story",
  coursesTitle: "Courses",
  appsTitle: "Apps",
  footerNote: "Educational use only. Not legal, tax, or financial advice.",
};

const ES: PageContent = {
  heroTitle: "Donde se unen la educación y la alfabetización financiera",
  storyTitle: "Nuestra Historia",
  coursesTitle: "Cursos",
  appsTitle: "Aplicaciones",
  footerNote: "Solo para fines educativos. No es asesoría legal, fiscal ni financiera.",
};

export function getContent(locale: Locale | string | undefined): PageContent {
  // Hard fallback so prerender can NEVER crash.
  const loc = (locale === "es" ? "es" : "en") as Locale;
  return loc === "es" ? ES : EN;
}
