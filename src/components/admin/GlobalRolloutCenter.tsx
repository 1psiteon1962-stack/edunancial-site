"use client";

import { useMemo, useState, type ReactNode } from "react";

import { globalRolloutConfig } from "@/lib/global-rollout/config";
import {
  getAIFeatureCatalog,
  getCourseCatalog,
  getCurrencyCatalog,
  getLanguageCatalog,
  getMarketingCampaignCatalog,
  getMembershipPlanCatalog,
  getProductCatalog,
} from "@/lib/global-rollout/service";

import type {
  AIFeatureId,
  CountryRolloutDefinition,
  GlobalRolloutConfig,
  MarketingCampaignId,
  MembershipPlanId,
  ProductId,
  ReadinessFlag,
  RolloutFeature,
  CourseId,
} from "@/types/global-rollout";
import type { PaymentProviderType } from "@/lib/payments/providers";

const featureLabels: Record<RolloutFeature, string> = {
  marketplace: "Marketplace",
  aiCoach: "AI Coach",
  familyLearning: "Family Learning",
  financialPassport: "Financial Passport",
  memberships: "Memberships",
};

const languageCatalog = getLanguageCatalog();
const currencyCatalog = getCurrencyCatalog();
const productCatalog = getProductCatalog();
const courseCatalog = getCourseCatalog();
const membershipPlanCatalog = getMembershipPlanCatalog();
const aiFeatureCatalog = getAIFeatureCatalog();
const marketingCampaignCatalog = getMarketingCampaignCatalog();

type ArrayField =
  | "paymentProviders"
  | "products"
  | "courses"
  | "membershipPlans"
  | "aiFeatures"
  | "marketingCampaigns";

type ArrayValueMap = {
  paymentProviders: PaymentProviderType;
  products: ProductId;
  courses: CourseId;
  membershipPlans: MembershipPlanId;
  aiFeatures: AIFeatureId;
  marketingCampaigns: MarketingCampaignId;
};

function cloneConfig(): GlobalRolloutConfig {
  return JSON.parse(JSON.stringify(globalRolloutConfig)) as GlobalRolloutConfig;
}

function updateCountry(
  config: GlobalRolloutConfig,
  countryCode: string,
  updater: (country: CountryRolloutDefinition) => CountryRolloutDefinition
) {
  return {
    ...config,
    countries: config.countries.map((country) =>
      country.code === countryCode ? updater(country) : country
    ),
  };
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#101a2f] p-6 shadow-2xl">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-5 space-y-3">{children}</div>
    </section>
  );
}

export default function GlobalRolloutCenter() {
  const [config, setConfig] = useState<GlobalRolloutConfig>(() => cloneConfig());
  const [selectedCountryCode, setSelectedCountryCode] = useState(config.countries[0]?.code ?? "US");

  const selectedCountry = useMemo(
    () => config.countries.find((country) => country.code === selectedCountryCode) ?? config.countries[0],
    [config.countries, selectedCountryCode]
  );

  const summary = useMemo(
    () => ({
      enabledContinents: config.continents.filter((continent) => continent.enabled).length,
      enabledCountries: config.countries.filter((country) => country.enabled).length,
      enabledLanguages: config.languages.filter((language) => language.enabled).length,
      enabledCurrencies: config.currencies.filter((currency) => currency.enabled).length,
    }),
    [config]
  );

  function toggleCountryArrayField<K extends ArrayField>(field: K, value: ArrayValueMap[K]) {
    setConfig((currentConfig) =>
      updateCountry(currentConfig, selectedCountryCode, (country) => {
        const values = country[field] as ArrayValueMap[K][];

        return {
          ...country,
          [field]: values.includes(value)
            ? values.filter((item) => item !== value)
            : [...values, value],
        } as CountryRolloutDefinition;
      })
    );
  }

  function toggleReadiness(flag: ReadinessFlag) {
    setConfig((currentConfig) =>
      updateCountry(currentConfig, selectedCountryCode, (country) => ({
        ...country,
        readiness: {
          ...country.readiness,
          [flag]: !country.readiness[flag],
        },
      }))
    );
  }

  function toggleFeature(feature: RolloutFeature) {
    setConfig((currentConfig) =>
      updateCountry(currentConfig, selectedCountryCode, (country) => ({
        ...country,
        featureAvailability: {
          ...country.featureAvailability,
          [feature]: !country.featureAvailability[feature],
        },
      }))
    );
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">
              Administration dashboard
            </p>
            <h1 className="mt-4 text-5xl font-black">Global Rollout Center</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Manage market activation from one global codebase. The controls below are configuration-ready for future persistence while preserving current routes and launch defaults.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-sm text-slate-300">
            Preview-only admin state for this repository build.
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-[#101a2f] p-6">
            <p className="text-sm text-slate-400">Enabled continents</p>
            <p className="mt-3 text-4xl font-black">{summary.enabledContinents}</p>
          </div>
          <div className="rounded-2xl bg-[#101a2f] p-6">
            <p className="text-sm text-slate-400">Enabled countries</p>
            <p className="mt-3 text-4xl font-black">{summary.enabledCountries}</p>
          </div>
          <div className="rounded-2xl bg-[#101a2f] p-6">
            <p className="text-sm text-slate-400">Enabled languages</p>
            <p className="mt-3 text-4xl font-black">{summary.enabledLanguages}</p>
          </div>
          <div className="rounded-2xl bg-[#101a2f] p-6">
            <p className="text-sm text-slate-400">Enabled currencies</p>
            <p className="mt-3 text-4xl font-black">{summary.enabledCurrencies}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <SectionCard title="Continents">
              {config.continents.map((continent) => (
                <label key={continent.code} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                  <span>{continent.name}</span>
                  <input
                    type="checkbox"
                    checked={continent.enabled}
                    onChange={() =>
                      setConfig((currentConfig) => ({
                        ...currentConfig,
                        continents: currentConfig.continents.map((item) =>
                          item.code === continent.code ? { ...item, enabled: !item.enabled } : item
                        ),
                      }))
                    }
                    aria-label={`Toggle ${continent.name}`}
                  />
                </label>
              ))}
            </SectionCard>

            <SectionCard title="Languages">
              {config.languages.map((language) => (
                <label key={language.code} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                  <span>{language.nativeName}</span>
                  <input
                    type="checkbox"
                    checked={language.enabled}
                    onChange={() =>
                      setConfig((currentConfig) => ({
                        ...currentConfig,
                        languages: currentConfig.languages.map((item) =>
                          item.code === language.code ? { ...item, enabled: !item.enabled } : item
                        ),
                      }))
                    }
                    aria-label={`Toggle ${language.name}`}
                  />
                </label>
              ))}
            </SectionCard>

            <SectionCard title="Currencies">
              {config.currencies.map((currency) => (
                <label key={currency.code} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                  <span>{currency.code}</span>
                  <input
                    type="checkbox"
                    checked={currency.enabled}
                    onChange={() =>
                      setConfig((currentConfig) => ({
                        ...currentConfig,
                        currencies: currentConfig.currencies.map((item) =>
                          item.code === currency.code ? { ...item, enabled: !item.enabled } : item
                        ),
                      }))
                    }
                    aria-label={`Toggle ${currency.name}`}
                  />
                </label>
              ))}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#101a2f] p-6 shadow-2xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-black">Country controls</h2>
                  <p className="mt-2 text-sm text-slate-300">Market activation, localized offerings, and rollout readiness.</p>
                </div>
                <label className="text-sm font-semibold text-slate-200">
                  <span className="mb-2 block">Country</span>
                  <select
                    value={selectedCountryCode}
                    onChange={(event) => setSelectedCountryCode(event.target.value)}
                    className="min-w-56 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    aria-label="Select country for rollout settings"
                  >
                    {config.countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-4">
                  <span>Country enabled</span>
                  <input
                    type="checkbox"
                    checked={selectedCountry.enabled}
                    onChange={() =>
                      setConfig((currentConfig) =>
                        updateCountry(currentConfig, selectedCountryCode, (country) => ({
                          ...country,
                          enabled: !country.enabled,
                        }))
                      )
                    }
                    aria-label={`Enable ${selectedCountry.name}`}
                  />
                </label>

                <div className="rounded-2xl bg-slate-950/80 px-4 py-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Compliance profile</p>
                  <p className="mt-2">{selectedCountry.complianceProfileId}</p>
                  <p className="mt-2">Time zones: {selectedCountry.timeZones.join(", ")}</p>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="Readiness status">
                {Object.entries(selectedCountry.readiness).map(([flag, value]) => (
                  <label key={flag} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                    <span>{flag}</span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => toggleReadiness(flag as ReadinessFlag)}
                      aria-label={`Toggle ${flag}`}
                    />
                  </label>
                ))}
              </SectionCard>

              <SectionCard title="Feature activation">
                {Object.entries(featureLabels).map(([feature, label]) => (
                  <label key={feature} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={selectedCountry.featureAvailability[feature as RolloutFeature]}
                      onChange={() => toggleFeature(feature as RolloutFeature)}
                      aria-label={`Toggle ${label}`}
                    />
                  </label>
                ))}
              </SectionCard>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <SectionCard title="Country languages">
                {languageCatalog.map((language) => (
                  <label key={language.code} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                    <span>{language.nativeName}</span>
                    <input
                      type="checkbox"
                      checked={selectedCountry.supportedLanguages.includes(language.code)}
                      onChange={() =>
                        setConfig((currentConfig) =>
                          updateCountry(currentConfig, selectedCountryCode, (country) => ({
                            ...country,
                            supportedLanguages: country.supportedLanguages.includes(language.code)
                              ? country.supportedLanguages.filter((item) => item !== language.code)
                              : [...country.supportedLanguages, language.code],
                          }))
                        )
                      }
                      aria-label={`Toggle ${language.name}`}
                    />
                  </label>
                ))}
              </SectionCard>

              <SectionCard title="Country currencies">
                {currencyCatalog.map((currency) => (
                  <label key={currency.code} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                    <span>{currency.code}</span>
                    <input
                      type="checkbox"
                      checked={selectedCountry.supportedCurrencies.includes(currency.code)}
                      onChange={() =>
                        setConfig((currentConfig) =>
                          updateCountry(currentConfig, selectedCountryCode, (country) => ({
                            ...country,
                            supportedCurrencies: country.supportedCurrencies.includes(currency.code)
                              ? country.supportedCurrencies.filter((item) => item !== currency.code)
                              : [...country.supportedCurrencies, currency.code],
                          }))
                        )
                      }
                      aria-label={`Toggle ${currency.name}`}
                    />
                  </label>
                ))}
              </SectionCard>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <SectionCard title="Payment providers">
                {[
                  "square",
                  "paypal",
                  "stripe",
                  "flutterwave",
                  "paystack",
                  "mtn-mobile-money",
                  "airtel-money",
                  "mpesa",
                  "bank-transfer",
                ].map((provider) => (
                  <label key={provider} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                    <span>{provider}</span>
                    <input
                      type="checkbox"
                      checked={selectedCountry.paymentProviders.includes(provider as PaymentProviderType)}
                      onChange={() => toggleCountryArrayField("paymentProviders", provider as PaymentProviderType)}
                      aria-label={`Toggle ${provider}`}
                    />
                  </label>
                ))}
              </SectionCard>

              <SectionCard title="Membership plans">
                {membershipPlanCatalog.map((plan) => (
                  <label key={plan.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                    <span>{plan.label}</span>
                    <input
                      type="checkbox"
                      checked={selectedCountry.membershipPlans.includes(plan.id)}
                      onChange={() => toggleCountryArrayField("membershipPlans", plan.id)}
                      aria-label={`Toggle ${plan.label}`}
                    />
                  </label>
                ))}
              </SectionCard>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <SectionCard title="Products">
                {productCatalog.map((product) => (
                  <label key={product.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                    <span>{product.label}</span>
                    <input
                      type="checkbox"
                      checked={selectedCountry.products.includes(product.id)}
                      onChange={() => toggleCountryArrayField("products", product.id)}
                      aria-label={`Toggle ${product.label}`}
                    />
                  </label>
                ))}
              </SectionCard>

              <SectionCard title="Courses">
                {courseCatalog.map((course) => (
                  <label key={course.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                    <span>{course.label}</span>
                    <input
                      type="checkbox"
                      checked={selectedCountry.courses.includes(course.id)}
                      onChange={() => toggleCountryArrayField("courses", course.id)}
                      aria-label={`Toggle ${course.label}`}
                    />
                  </label>
                ))}
              </SectionCard>

              <SectionCard title="AI + campaigns">
                {aiFeatureCatalog.map((feature) => (
                  <label key={feature.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                    <span>{feature.label}</span>
                    <input
                      type="checkbox"
                      checked={selectedCountry.aiFeatures.includes(feature.id)}
                      onChange={() => toggleCountryArrayField("aiFeatures", feature.id)}
                      aria-label={`Toggle ${feature.label}`}
                    />
                  </label>
                ))}
                {marketingCampaignCatalog.map((campaign) => (
                  <label key={campaign.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/80 px-4 py-3">
                    <span>{campaign.label}</span>
                    <input
                      type="checkbox"
                      checked={selectedCountry.marketingCampaigns.includes(campaign.id)}
                      onChange={() => toggleCountryArrayField("marketingCampaigns", campaign.id)}
                      aria-label={`Toggle ${campaign.label}`}
                    />
                  </label>
                ))}
              </SectionCard>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
