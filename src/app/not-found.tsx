"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function NotFound() {
  const { t } = useInternationalPreferences();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#08101f] px-6 text-center text-white">
      <h1 className="text-6xl font-black">404</h1>
      <h2 className="mt-4 text-3xl font-black">{t("notFound.title")}</h2>
      <p className="mt-4 max-w-xl text-slate-300">{t("notFound.body")}</p>
      <p className="mt-2 max-w-xl text-slate-400">{t("notFound.help")}</p>
      <Link href="/" className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700">
        {t("notFound.homeCta")}
      </Link>
    </main>
  );
}
