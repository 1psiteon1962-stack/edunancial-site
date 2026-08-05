"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export interface ComingSoonProps {
  /** i18n key for the eyebrow label (e.g. "comingSoon.label"). Falls back to the default label. */
  labelKey?: string;
  /** i18n key for the main heading (e.g. "comingSoon.stories.heading"). Falls back to the default heading. */
  headingKey?: string;
  /** i18n key for the body copy. Falls back to the default body. */
  bodyKey?: string;
  /** i18n key for the CTA button text. Omit to show no CTA. */
  ctaLabelKey?: string;
  /** Destination for the CTA button. Required if ctaLabelKey is provided. */
  ctaHref?: string;
  /** Optional additional className for the outer section. */
  className?: string;
}

/**
 * Reusable "Coming Soon" state for genuinely empty or unfinished public-facing sections.
 * Uses the shared i18n system so all strings translate automatically.
 */
export default function ComingSoon({
  labelKey = "comingSoon.label",
  headingKey = "comingSoon.heading",
  bodyKey = "comingSoon.body",
  ctaLabelKey,
  ctaHref,
  className = "",
}: ComingSoonProps) {
  const { t } = useInternationalPreferences();

  return (
    <div
      className={`rounded-3xl border border-dashed border-white/20 bg-white/5 px-8 py-16 text-center ${className}`}
      role="status"
      aria-label={t(labelKey)}
    >
      <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-400">
        {t(labelKey)}
      </p>

      <h3 className="mx-auto mt-4 max-w-2xl text-2xl font-black sm:text-3xl">
        {t(headingKey)}
      </h3>

      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300">
        {t(bodyKey)}
      </p>

      {ctaLabelKey && ctaHref && (
        <Link
          href={ctaHref}
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f]"
        >
          {t(ctaLabelKey)}
        </Link>
      )}
    </div>
  );
}
