"use client";

import Link from "next/link";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

const navigation = [
  { key: "nav.home", href: "/" },
  { key: "nav.books", href: "/books" },
  { key: "nav.courses", href: "/courses" },
  { key: "nav.terms", href: "/terms" },
  { key: "nav.membership", href: "/membership" },
  { key: "nav.downloads", href: "/downloads" },
] as const;

export default function Navbar() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#08101f]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="text-2xl font-black tracking-wide text-white">
          EDUNANCIAL
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-slate-300 transition hover:text-white md:inline-flex"
          >
            {t("nav.login")}
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            {t("nav.signup")}
          </Link>
        </div>
      </div>
    </header>
  );
}
