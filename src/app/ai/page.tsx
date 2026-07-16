"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function AIPage() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl p-10">
        <h1 className="text-5xl font-bold">{t("aiAssistant.title")}</h1>

        <textarea
          className="mt-10 w-full rounded-lg border p-4"
          rows={8}
          placeholder={t("aiAssistant.placeholder")}
        />

        <button className="mt-6 rounded bg-blue-600 px-6 py-3 text-white">
          {t("aiAssistant.submit")}
        </button>
      </div>
    </main>
  );
}
