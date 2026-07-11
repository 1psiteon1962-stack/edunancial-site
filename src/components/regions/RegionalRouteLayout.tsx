import Link from "next/link";

import RegionAnalyticsHook from "@/components/regions/RegionAnalyticsHook";
import {
  type GlobalRegionArchitecture,
  REGION_SECTION_SLUGS,
  getRegionSectionPath,
} from "@/lib/globalRegionArchitecture";

type RegionalRouteLayoutProps = {
  region: GlobalRegionArchitecture;
  children: React.ReactNode;
};

const sectionLabels: Record<(typeof REGION_SECTION_SLUGS)[number], string> = {
  legal: "Legal",
  privacy: "Privacy",
  terms: "Terms",
  contact: "Contact",
  membership: "Membership",
  dashboard: "Dashboard",
  assessment: "Assessment",
  "curriculum-upload": "Curriculum Upload",
};

export default function RegionalRouteLayout({
  region,
  children,
}: RegionalRouteLayoutProps) {
  return (
    <div
      className="min-h-screen bg-[#08101f] text-white"
      data-region={region.slug}
      data-analytics-region={region.analyticsKey}
    >
      <RegionAnalyticsHook region={region.slug} surface="layout" />

      <section className="border-b border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
            {region.eyebrow}
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black md:text-5xl">{region.name}</h1>
              <p className="mt-4 max-w-4xl text-lg text-slate-300">
                {region.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${region.slug}`}
                className="rounded-lg border border-white/20 px-4 py-3 font-semibold hover:bg-white hover:text-slate-950"
              >
                Region Home
              </Link>
              {region.legacyRoute ? (
                <Link
                  href={region.legacyRoute}
                  className="rounded-lg border border-white/20 px-4 py-3 font-semibold hover:bg-white hover:text-slate-950"
                >
                  Existing Route
                </Link>
              ) : null}
            </div>
          </div>

          <nav className="mt-8 flex flex-wrap gap-3">
            {REGION_SECTION_SLUGS.map((section) => (
              <Link
                key={section}
                href={getRegionSectionPath(region.slug, section)}
                className="rounded-lg bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white hover:text-slate-950"
              >
                {sectionLabels[section]}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {children}
    </div>
  );
}
