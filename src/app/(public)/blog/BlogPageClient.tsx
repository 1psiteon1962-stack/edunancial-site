"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import ComingSoon from "@/components/ComingSoon";

const TOPICS = [
  "Financial Literacy",
  "Economic Self Defense",
  "Business Ownership",
  "Real Estate",
  "Paper Assets",
  "Entrepreneurship",
] as const;

export default function BlogPageClient() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-400">
          {t("comingSoon.label")}
        </p>

        <h1 className="mt-6 text-5xl font-black sm:text-6xl">Blog</h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          {t("comingSoon.blog.body")}
        </p>

        <ul className="mt-8 flex flex-wrap gap-3" aria-label="Upcoming topics">
          {TOPICS.map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300"
            >
              {topic}
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <ComingSoon
            labelKey="comingSoon.label"
            headingKey="comingSoon.blog.heading"
            bodyKey="comingSoon.blog.body"
            ctaLabelKey="comingSoon.blog.cta"
            ctaHref="/curriculum"
          />
        </div>
      </section>
    </main>
  );
}
