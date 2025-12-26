"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Language } from "@/lib/i18n";

const LANGS: Language[] = ["en", "es", "fr", "ar"];

export default function LanguageSwitcher() {
  const path = usePathname();

  return (
    <nav style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
      {LANGS.map((lang) => (
        <Link key={lang} href={path.replace(/\/(en|es|fr|ar)/, `/${lang}`)}>
          {lang.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
