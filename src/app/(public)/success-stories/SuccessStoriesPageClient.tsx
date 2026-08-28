"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import ComingSoon from "@/components/ComingSoon";

const MEMBER_TYPE_KEYS = [
  "successStories.memberTypes.students",
  "successStories.memberTypes.families",
  "successStories.memberTypes.entrepreneurs",
  "successStories.memberTypes.veterans",
  "successStories.memberTypes.professionals",
  "successStories.memberTypes.smallBusinessOwners",
  "successStories.memberTypes.youngInvestors",
  "successStories.memberTypes.communityLeaders",
] as const;

export default function SuccessStoriesPageClient() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-400">
          {t("comingSoon.label")}
        </p>

        <h1 className="mt-6 text-5xl font-black sm:text-6xl">
          {t("comingSoon.successStories.heading")}
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          {t("comingSoon.successStories.body")}
        </p>

        <ul className="mt-8 flex flex-wrap gap-3" aria-label={t("successStories.memberTypes.ariaLabel")}>
          {MEMBER_TYPE_KEYS.map((key) => (
            <li
              key={key}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300"
            >
              {t(key)}
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <ComingSoon
            labelKey="comingSoon.label"
            headingKey="comingSoon.successStories.heading"
            bodyKey="comingSoon.successStories.body"
            ctaLabelKey="comingSoon.successStories.cta"
            ctaHref="/register"
          />
        </div>
      </section>
    </main>
  );
}
