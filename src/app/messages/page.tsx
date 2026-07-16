"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function Messages() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-10">
        <h1 className="text-5xl font-bold">
          {t("page.messages.title")}
        </h1>
        <div className="rounded-xl border p-8 mt-8">
          {t("page.messages.inbox")}
        </div>
      </div>
    </main>
  );
}
