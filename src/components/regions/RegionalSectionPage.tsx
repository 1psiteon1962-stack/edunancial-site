import Link from "next/link";

import RegionAnalyticsHook from "@/components/regions/RegionAnalyticsHook";
import {
  type GlobalRegionArchitecture,
  type RegionSectionSlug,
  getRegionSectionPath,
} from "@/lib/globalRegionArchitecture";

type RegionalSectionPageProps = {
  region: GlobalRegionArchitecture;
  section: RegionSectionSlug;
};

const SECTION_CONTENT: Record<
  RegionSectionSlug,
  {
    title: string;
    description: string;
    sharedPath?: string;
  }
> = {
  legal: {
    title: "Regional legal routing",
    description:
      "This architecture route anchors shared legal navigation for the region without changing the repository's existing legal content model.",
  },
  privacy: {
    title: "Regional privacy routing",
    description:
      "This route keeps privacy navigation region-aware while the shared privacy page remains the current authoritative policy surface.",
    sharedPath: "/privacy",
  },
  terms: {
    title: "Regional terms routing",
    description:
      "This route keeps terms navigation region-aware while preserving the existing shared terms implementation.",
    sharedPath: "/terms",
  },
  contact: {
    title: "Regional contact routing",
    description:
      "This route keeps contact entry points consistent across regions and forwards users to the shared contact experience when needed.",
    sharedPath: "/contact",
  },
  membership: {
    title: "Regional membership routing",
    description:
      "This regional membership surface preserves the current shared membership behavior while reserving the route family for future regional specialization.",
    sharedPath: "/membership",
  },
  dashboard: {
    title: "Regional dashboard routing",
    description:
      "This dashboard route preserves the existing shared dashboard while reserving the regional information architecture for future expansion.",
    sharedPath: "/dashboard",
  },
  assessment: {
    title: "Assessment engine placeholder",
    description:
      "This route is a region-scoped assessment placeholder that keeps the current shared assessment flow intact while establishing the required architecture hook.",
    sharedPath: "/assessment",
  },
  "curriculum-upload": {
    title: "Future curriculum upload path",
    description:
      "This route documents the reserved curriculum intake location for the region without creating or modifying curriculum content.",
  },
};

export default function RegionalSectionPage({
  region,
  section,
}: RegionalSectionPageProps) {
  const content = SECTION_CONTENT[section];

  return (
    <section
      className="mx-auto max-w-7xl px-6 py-20"
      data-region={region.slug}
      data-region-section={section}
    >
      <RegionAnalyticsHook
        region={region.slug}
        surface={`section:${section}`}
      />

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-8">
          <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
            {region.name}
          </p>
          <h2 className="mt-6 text-4xl font-black text-white">
            {content.title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            {content.description}
          </p>

          {section === "curriculum-upload" ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
                Reserved path
              </p>
              <code className="mt-4 block text-sm text-slate-200">
                {region.curriculumUploadPath}
              </code>
              <p className="mt-4 text-slate-300">
                The directory exists as an empty staging location for future
                regional uploads only.
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/${region.slug}`}
              className="rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700"
            >
              Return to {region.name}
            </Link>
            {content.sharedPath ? (
              <Link
                href={content.sharedPath}
                className="rounded-lg border border-white/20 px-5 py-3 font-bold hover:bg-white hover:text-slate-950"
              >
                Open current shared page
              </Link>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-8">
          <h3 className="text-2xl font-black text-white">Architecture checks</h3>
          <ul className="mt-6 space-y-4 text-slate-300">
            <li>Route family exists for {region.slug}.</li>
            <li>Navigation is exposed through the shared regional layout.</li>
            <li>Pricing key: {region.pricingKey}.</li>
            <li>Default locale: {region.locale}.</li>
            <li>Analytics hook: {region.analyticsKey}.</li>
            <li>
              Privacy path: {getRegionSectionPath(region.slug, "privacy")}
            </li>
            <li>Terms path: {getRegionSectionPath(region.slug, "terms")}</li>
            <li>
              Contact path: {getRegionSectionPath(region.slug, "contact")}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
