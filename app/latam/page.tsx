// app/latam/[lang]/page.tsx

import { notFound } from "next/navigation";
import { resolveCopy } from "@/lib/core";

/**
 * LATAM supports ONLY these languages.
 * This is the narrow union TypeScript needs.
 */
const LATAM_LANGUAGES = ["es", "pt"] as const;
type LatamLanguage = (typeof LATAM_LANGUAGES)[number];

export default function Page({
  params,
}: {
  params: { lang: string };
}) {
  // 🔒 Runtime + type guard
  if (!LATAM_LANGUAGES.includes(params.lang as LatamLanguage)) {
    notFound();
  }

  const lang = params.lang as LatamLanguage;

  const copy =
    resolveCopy("LATAM", lang) ??
    resolveCopy("LATAM", "es");

  if (!copy) {
    notFound();
  }

  return (
    <main>
      {copy}
    </main>
  );
}
