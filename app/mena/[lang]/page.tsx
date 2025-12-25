// app/mena/[lang]/page.tsx

import { notFound } from "next/navigation";

/**
 * Supported languages for MENA mirror
 * Fully enumerated for static export
 */
const SUPPORTED_LANGUAGES = ["ar", "fr", "en"] as const;

type Lang = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * REQUIRED for Next.js static export
 */
export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default function MenaPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang = params.lang as Lang;

  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <h1>Edunancial — MENA</h1>

      <p>
        Edunancial operates a global knowledge and infrastructure platform
        designed to help individuals, entrepreneurs, and
