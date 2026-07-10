"use client";

import Link from "next/link";

import { useI18n } from "@/lib/i18n";

export default function CallToAction() {
  const { t } = useI18n();

  return (
    <section className="bg-[#0b1020] py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-5xl font-black text-white">
          {t("cta.start_building")}
        </h2>

        <p className="mt-6 text-xl text-gray-300">{t("cta.subtitle")}</p>

        <Link
          href="/membership"
          className="mt-10 inline-block rounded-xl bg-blue-600 px-10 py-4 font-bold text-white hover:bg-blue-700"
        >
          {t("cta.become_member")}
        </Link>
      </div>
    </section>
  );
}
