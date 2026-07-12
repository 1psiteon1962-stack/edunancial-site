"use client";

import Link from "next/link";
import { APAC_LOCALE_CONFIG } from "@/config/asia-pacific/index";

interface Props {
  currentLocale: string;
}

export default function ApacLanguageSelector({ currentLocale }: Props) {
  return (
    <nav aria-label="Asia-Pacific language selector" className="flex flex-wrap gap-2">
      {APAC_LOCALE_CONFIG.map((locale) => (
        <Link
          key={locale.code}
          href={`/asia-pacific/${locale.code}`}
          className={`rounded-lg px-3 py-1 text-sm font-bold transition-colors ${
            locale.code === currentLocale
              ? "bg-blue-600 text-white"
              : "border border-white/20 text-slate-300 hover:border-blue-500 hover:text-white"
          }`}
          lang={locale.hreflang}
          aria-current={locale.code === currentLocale ? "page" : undefined}
        >
          {locale.nativeLabel}
        </Link>
      ))}
    </nav>
  );
}
