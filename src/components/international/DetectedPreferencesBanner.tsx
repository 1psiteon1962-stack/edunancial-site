"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { getLanguageByCode } from "@/lib/international/languages";

export default function DetectedPreferencesBanner() {
  const { preferences, showDetectionBanner, dismissDetectionBanner, t } =
    useInternationalPreferences();

  const localTime = (() => {
    try { return new Intl.DateTimeFormat(preferences.preferredLanguage === "es-Caribbean" ? "es-DO" : preferences.preferredLanguage, { timeZone: preferences.timeZone, hour: "numeric", minute: "2-digit", hour12: true }).format(new Date()); }
    catch { return null; }
  })();

  if (!showDetectionBanner) {
    return null;
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      className="border-b border-blue-500/30 bg-blue-500/10"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 text-sm text-blue-50 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 break-words">
          <p className="font-bold">{t("banner.title")}</p>
          <p className="mt-1">
            {t("banner.language")}:{" "}
            {getLanguageByCode(preferences.preferredLanguage)?.nativeLabel ?? "English"}
          </p>
          <p>{t("banner.country")}: {preferences.country.toUpperCase()}</p>
          {localTime && <p>{t("banner.localTime")}: {localTime}</p>}
          <p>
            {t("banner.region")}: {preferences.region}
          </p>
          <p>
            {t("banner.currency")}: {preferences.preferredCurrency}
          </p>
          <p>
            {t("banner.source")}:{" "}
            {preferences.languageSelectionSource === "user-confirmed"
              ? t("banner.sourceManual")
              : t("banner.sourceDetected")}
          </p>
          <p className="mt-1">{t("banner.message")}</p>
        </div>
        <button
          type="button"
          onClick={dismissDetectionBanner}
          className="self-start rounded-lg border border-blue-300 px-3 py-1.5 font-semibold text-blue-100 hover:bg-blue-400/20"
        >
          {t("banner.dismiss")}
        </button>
      </div>
    </aside>
  );
}
