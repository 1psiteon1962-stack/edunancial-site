// app/mena/[lang]/page.tsx

import { notFound } from "next/navigation";

type Props = {
  params: {
    lang: string;
  };
};

/**
 * Local language allowlist for this route.
 * This avoids a hard dependency on exports from "@/lib/i18n"
 * and prevents Netlify builds from failing if i18n exports change.
 *
 * Adjust this list ONLY if you intentionally support more langs under /mena.
 */
const MENA_LANGS = ["en", "ar"] as const;
type MenaLang = (typeof MENA_LANGS)[number];

function isMenaLang(value: string): value is MenaLang {
  return (MENA_LANGS as readonly string[]).includes(value);
}

export default function MenaPage({ params }: Props) {
  const { lang } = params;

  if (!isMenaLang(lang)) {
    notFound();
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 700 }}>
        MENA Page ({lang})
      </h1>

      <p style={{ marginTop: "12px" }}>
        This route is validated locally to prevent build breakage from missing i18n exports.
      </p>
    </main>
  );
}
