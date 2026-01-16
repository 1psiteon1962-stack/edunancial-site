"use client";

import { t } from "@/lib/i18n";

type Props = {
  lang: string;
};

export default function LocalizedDoctrine({ lang }: Props) {
  return (
    <section className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-4">
        {t("doctrine.title")}
      </h1>

      <p className="text-lg text-gray-700">
        {t("doctrine.intro")}
      </p>

      <div className="mt-8 space-y-6">
        <p>{t("doctrine.section1")}</p>
        <p>{t("doctrine.section2")}</p>
        <p>{t("doctrine.section3")}</p>
      </div>
    </section>
  );
}
