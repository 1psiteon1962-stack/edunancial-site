"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LANGS = ["en", "es", "fr", "de", "ar"];

export default function LanguageSwitcher({
  locale,
}: {
  locale: string;
}) {
  const pathname = usePathname();

  // Absolute TypeScript safety: pathname CAN be null during build
  if (!pathname) {
    return null;
  }

  // Normalize path by removing existing locale prefix if present
  const normalizedPath = pathname.replace(
    new RegExp(`^/(${LANGS.join("|")})`),
    ""
  );

  return (
    <nav style={{ display: "flex", gap: "0.75rem", fontSize: "0.9rem" }}>
      {LANGS.map((lang) => (
        <Link
          key={lang}
          href={`/${lang}${normalizedPath || "/"}`}
          style={{
            textDecoration: lang === locale ? "underline" : "none",
            fontWeight: lang === locale ? 600 : 400,
          }}
        >
          {lang.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
