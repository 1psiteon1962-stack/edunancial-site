// app/eu/[lang]/page.tsx

import { notFound } from "next/navigation";

/**
 * Supported languages for EU mirror
 * Fully enumerated for static export
 */
const SUPPORTED_LANGUAGES = ["en", "fr", "de", "es"] as const;

type Lang = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * REQUIRED for Next.js static export
 */
export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default function EuPage({
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
      <h1>Edunancial — Europe</h1>

      <p>
        Edunancial operates a global knowledge and infrastructure platform
        designed to help individuals, entrepreneurs, and organizations better
        understand how modern economic systems function in real-world
        environments.
      </p>

      <p>
        The Europe mirror focuses on regulatory alignment, cross-border
        operations, capital mobility, compliance-aware growth, and the practical
        realities of operating across multiple sovereign and supranational
        systems.
      </p>

      <p>
        Rather than generalized instruction or advice, Edunancial deploys
        modular frameworks and reference models that can be adapted, localized,
        and scaled to reflect European market conditions while maintaining a
        consistent strategic core.
      </p>

      <p>
        Language selected
