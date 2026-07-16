"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function MediaPage() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-6xl mx-auto p-10">
        <h1 className="text-5xl font-black">
          {t("page.media.title")}
        </h1>
        <p className="mt-6">
          {t("page.media.description")}
        </p>
      </div>
    </main>
  );
}
