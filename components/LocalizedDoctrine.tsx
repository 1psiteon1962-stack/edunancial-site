"use client";

import { useTranslations } from "next-intl";

type Props = {
  lang: string;
};

export default function LocalizedDoctrine({ lang }: Props) {
  // Scope to the "doctrine" namespace
  const t = useTranslations("doctrine");

  return (
    <section className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-4">
        {t("title")}
      </h1>

      <p className="text-lg text-gray-700">
        {t("intro")}
      </p>

      <div className="mt-8 space-y-6">
        <p>{t("section1")}</p>
        <p>{t("section2")}</p>
        <p>{t("section3")}</p>
      </div>
    </section>
  );
}
