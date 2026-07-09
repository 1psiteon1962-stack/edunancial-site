"use client";

import { useGlobalRollout } from "@/components/global-rollout/GlobalRolloutProvider";
import {
  getComplianceProfile,
  getCourseCatalog,
  getPaymentProviders,
  getProductCatalog,
  isCourseAvailable,
  isFeatureEnabled,
  isProductAvailable,
} from "@/lib/global-rollout/service";

const spotlightFeatures = [
  { key: "marketplace", label: "Marketplace" },
  { key: "aiCoach", label: "AI Coach" },
  { key: "familyLearning", label: "Family Learning" },
  { key: "financialPassport", label: "Financial Passport" },
] as const;

function AvailabilityPill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        active ? "bg-emerald-500/15 text-emerald-200" : "bg-amber-500/15 text-amber-100"
      }`}
    >
      {active ? "Available" : "Planned"}
    </span>
  );
}

export default function GlobalPreferenceSummary() {
  const { activeCountry, activeRegion, selectedCurrency, selectedLanguage } = useGlobalRollout();
  const complianceProfile = getComplianceProfile(activeCountry.code);
  const providers = getPaymentProviders(activeCountry.code);
  const courses = getCourseCatalog();
  const products = getProductCatalog();

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-3xl border border-white/10 bg-[#101a2f] p-8 text-white shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">
          Active market profile
        </p>
        <h2 className="mt-4 text-4xl font-black">{activeCountry.name}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
          One global codebase, configuration-driven market controls, and reusable launch readiness gates for future regional activation.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-950/80 p-5">
            <p className="text-sm text-slate-400">Region</p>
            <p className="mt-2 text-xl font-bold">{activeRegion.name}</p>
          </div>
          <div className="rounded-2xl bg-slate-950/80 p-5">
            <p className="text-sm text-slate-400">Language</p>
            <p className="mt-2 text-xl font-bold">{selectedLanguage.toUpperCase()}</p>
          </div>
          <div className="rounded-2xl bg-slate-950/80 p-5">
            <p className="text-sm text-slate-400">Currency</p>
            <p className="mt-2 text-xl font-bold">{selectedCurrency}</p>
          </div>
          <div className="rounded-2xl bg-slate-950/80 p-5">
            <p className="text-sm text-slate-400">Launch status</p>
            <p className="mt-2 text-xl font-bold">{activeCountry.enabled ? "Enabled" : "Pending"}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h3 className="text-xl font-bold">Feature activation</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {spotlightFeatures.map((feature) => (
                <div key={feature.key} className="flex items-center justify-between gap-4 rounded-xl bg-slate-900/70 p-4">
                  <span>{feature.label}</span>
                  <AvailabilityPill active={isFeatureEnabled(feature.key, activeCountry.code)} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h3 className="text-xl font-bold">Compliance + payments</h3>
            <p className="mt-4 text-sm text-slate-300">{complianceProfile.name}</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">{complianceProfile.description}</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-300">
              {providers.map((provider) => (
                <li key={provider.id} className="rounded-xl bg-slate-900/70 px-4 py-3">
                  {provider.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-white/10 bg-[#101a2f] p-8 text-white shadow-2xl">
        <div>
          <h3 className="text-2xl font-black">Course availability</h3>
          <div className="mt-5 space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between gap-4 rounded-xl bg-slate-950/80 p-4">
                <span>{course.label}</span>
                <AvailabilityPill active={isCourseAvailable(course.id, activeCountry.code)} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black">Product availability</h3>
          <div className="mt-5 space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-4 rounded-xl bg-slate-950/80 p-4">
                <span>{product.label}</span>
                <AvailabilityPill active={isProductAvailable(product.id, activeCountry.code)} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
