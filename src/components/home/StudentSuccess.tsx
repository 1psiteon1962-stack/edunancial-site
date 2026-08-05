"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import ComingSoon from "@/components/ComingSoon";

export default function StudentSuccess() {
  const { t } = useInternationalPreferences();

  return (
    <section className="py-24 bg-[#08101f]">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-5xl font-black">
          {t("memberStories.eyebrow")}
        </h2>

        <div className="mt-12">
          <ComingSoon
            labelKey="comingSoon.label"
            headingKey="comingSoon.stories.heading"
            bodyKey="comingSoon.stories.body"
            ctaLabelKey="comingSoon.stories.cta"
            ctaHref="/pricing"
          />
        </div>
      </div>
    </section>
  );
}
