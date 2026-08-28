"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import ComingSoon from "@/components/ComingSoon";
import { getSuccessPageCopy } from "@/lib/international/success-page-copy";

export default function StudentSuccessPageClient() {
  const { effectiveLanguage, t } = useInternationalPreferences();
  const copy = getSuccessPageCopy(effectiveLanguage);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-400">
          {t("comingSoon.label")}
        </p>
        <h1 className="mt-6 text-5xl font-black">{copy.studentSuccessHeading}</h1>

        <div className="mt-16">
          <ComingSoon
            labelKey="comingSoon.label"
            headingKey="comingSoon.successStories.heading"
            bodyKey="comingSoon.successStories.body"
            ctaLabelKey="comingSoon.successStories.cta"
            ctaHref="/register"
          />
        </div>
      </div>
    </main>
  );
}
