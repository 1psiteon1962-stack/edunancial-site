"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function VisionPage() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-10">
        <h1 className="text-5xl font-black">
          {t("page.vision.title")}
        </h1>
        <p className="mt-8 text-xl">
          {t("page.vision.description")}
        </p>
      </div>
    </main>
  );
}
