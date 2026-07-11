"use client";

import Link from "next/link";
import { useState } from "react";

import LanguagePreferenceSelector from "@/components/international/LanguagePreferenceSelector";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const navigation = [
  { key: "nav.home", href: "/" },
  { key: "nav.dashboard", href: "/dashboard" },
  { key: "nav.courses", href: "/courses" },
  { key: "nav.aiCoach", href: "/ai-coach" },
  { key: "nav.pricing", href: "/pricing" },
  { key: "nav.faq", href: "/faq" },
  { key: "nav.contact", href: "/contact" },
  { key: "nav.login", href: "/login" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { t } = useInternationalPreferences();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#08101f]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-3xl font-black">
          <span className="text-red-500">RED</span>
          <span className="text-white">.</span>
          <span className="text-white">WHITE</span>
          <span className="text-white">.</span>
          <span className="text-blue-500">BLUE</span>
        </Link>

        <nav className="hidden gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-slate-300 hover:text-white"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguagePreferenceSelector />
          <Link
            href="/membership"
            className="rounded-lg bg-blue-600 px-5 py-3 font-bold"
          >
            {t("nav.becomeMember")}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label={t("selector.globe")}
            aria-expanded={languageOpen}
            onClick={() => {
              setLanguageOpen((previous) => !previous);
              setMenuOpen(true);
            }}
            className="rounded-lg border border-slate-700 px-3 py-2"
          >
            🌐
          </button>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((previous) => !previous)}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold"
          >
            ☰
          </button>
        </div>
      </div>

      {(menuOpen || languageOpen) && (
        <div className="border-t border-slate-800 px-6 py-4 lg:hidden">
          <div className="mb-4">
            <LanguagePreferenceSelector compact />
          </div>
          <nav className="grid gap-2">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/membership"
              className="mt-2 rounded-lg bg-blue-600 px-3 py-2 text-center font-bold"
            >
              {t("nav.becomeMember")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
