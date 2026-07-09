"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { adminDataService } from "@/lib/admin/dataService";
import type { SystemConfig, MembershipPlan } from "@/lib/admin/types";

const TABS = [
  "General",
  "Membership Plans",
  "Feature Flags",
  "Email",
  "Notifications",
  "SEO",
  "Branding",
  "Languages",
  "Maintenance",
] as const;

type Tab = (typeof TABS)[number];

const FEATURE_FLAG_META: Record<string, { label: string; description: string }> = {
  ai_coach_enabled: { label: "AI Coach", description: "Enables the AI-powered financial coaching assistant." },
  marketplace_enabled: { label: "Marketplace", description: "Enables the provider marketplace and directory." },
  community_forum_enabled: { label: "Community Forum", description: "Enables member-to-member community discussion boards." },
  voice_assistant_enabled: { label: "Voice Assistant", description: "Enables voice-based interaction with learning tools." },
  certificate_generation: { label: "Certificate Generation", description: "Automatically issues certificates on course completion." },
  global_expansion: { label: "Global Expansion", description: "Enables country/region expansion dashboards and tooling." },
  analytics_beta: { label: "Analytics Beta", description: "Enables experimental analytics dashboards." },
  multi_tenant_mode: { label: "Multi-Tenant Mode", description: "Enables white-label multi-tenant deployments." },
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  pt: "Portuguese",
  sw: "Swahili",
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
        checked ? "bg-blue-600" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default function SystemConfigPage() {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const [toast, setToast] = useState<string | null>(null);
  const [maintenanceConfirmOpen, setMaintenanceConfirmOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  useEffect(() => {
    adminDataService.config.get().then(setConfig);
  }, []);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  async function saveConfig(patch: Partial<SystemConfig>) {
    const updated = await adminDataService.config.update(patch);
    setConfig(updated);
    showToast("Settings saved successfully.");
  }

  if (!config) {
    return <p className="text-gray-400">Loading configuration…</p>;
  }

  return (
    <div className="space-y-8">
      <PageHeader title="System Configuration" description="Manage global platform settings for Edunancial." />

      {toast && (
        <div
          role="status"
          className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-400"
        >
          ✓ {toast}
        </div>
      )}

      <div role="tablist" aria-label="Configuration sections" className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              activeTab === tab ? "bg-blue-600 text-white" : "border border-white/10 text-gray-300 hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "General" && (
        <form
          className="max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-[#101a2f] p-6"
          onSubmit={(e) => {
            e.preventDefault();
            showToast("General settings saved.");
          }}
        >
          <div>
            <label htmlFor="site-name" className="block text-sm font-bold text-gray-300">Site Name</label>
            <input
              id="site-name"
              value={config.siteName}
              onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="site-tagline" className="block text-sm font-bold text-gray-300">Site Tagline</label>
            <input
              id="site-tagline"
              value={config.siteTagline}
              onChange={(e) => setConfig({ ...config, siteTagline: e.target.value })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="support-email" className="block text-sm font-bold text-gray-300">Support Email</label>
              <input
                id="support-email"
                type="email"
                defaultValue="support@edunancial.com"
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className="block text-sm font-bold text-gray-300">Contact Phone</label>
              <input
                id="contact-phone"
                type="tel"
                defaultValue="+1-800-555-0100"
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500">
            Save Changes
          </button>
        </form>
      )}

      {activeTab === "Membership Plans" && (
        <div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {config.membershipPlans.map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white">{plan.name}</h3>
                    <p className="text-sm text-gray-400">
                      ${plan.price} / {plan.billingCycle}
                    </p>
                  </div>
                  {plan.isPopular && (
                    <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">POPULAR</span>
                  )}
                </div>
                <ul className="mt-4 space-y-1 text-sm text-gray-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-green-400" aria-hidden="true">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs font-bold text-gray-500">{plan.memberCount.toLocaleString()} members</p>
                <div className="mt-4 flex items-center justify-between">
                  <Toggle
                    checked={plan.isActive}
                    onChange={(v) =>
                      saveConfig({
                        membershipPlans: config.membershipPlans.map((p) =>
                          p.id === plan.id ? { ...p, isActive: v } : p
                        ),
                      })
                    }
                    label={`Toggle ${plan.name} active`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPlan(plan);
                      setPlanModalOpen(true);
                    }}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-gray-200 hover:bg-white/5"
                  >
                    Edit Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingPlan(null);
              setPlanModalOpen(true);
            }}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500"
          >
            + Add Plan
          </button>
        </div>
      )}

      {activeTab === "Feature Flags" && (
        <div className="max-w-2xl rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <div className="space-y-4">
            {Object.entries(config.featureFlags).map(([key, value]) => (
              <div key={key} className="flex items-start justify-between gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-bold text-white">{FEATURE_FLAG_META[key]?.label ?? key}</p>
                  <p className="text-sm text-gray-400">{FEATURE_FLAG_META[key]?.description ?? ""}</p>
                </div>
                <Toggle
                  checked={value}
                  onChange={(v) => setConfig({ ...config, featureFlags: { ...config.featureFlags, [key]: v } })}
                  label={`Toggle ${key}`}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => saveConfig({ featureFlags: config.featureFlags })}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500"
          >
            Save All Changes
          </button>
        </div>
      )}

      {activeTab === "Email" && (
        <form
          className="max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-[#101a2f] p-6"
          onSubmit={(e) => {
            e.preventDefault();
            saveConfig({ emailSettings: config.emailSettings });
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email-from-name" className="block text-sm font-bold text-gray-300">From Name</label>
              <input
                id="email-from-name"
                value={config.emailSettings.fromName}
                onChange={(e) => setConfig({ ...config, emailSettings: { ...config.emailSettings, fromName: e.target.value } })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="email-from" className="block text-sm font-bold text-gray-300">From Email</label>
              <input
                id="email-from"
                type="email"
                value={config.emailSettings.fromEmail}
                onChange={(e) => setConfig({ ...config, emailSettings: { ...config.emailSettings, fromEmail: e.target.value } })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email-reply-to" className="block text-sm font-bold text-gray-300">Reply-To</label>
              <input
                id="email-reply-to"
                type="email"
                value={config.emailSettings.replyTo}
                onChange={(e) => setConfig({ ...config, emailSettings: { ...config.emailSettings, replyTo: e.target.value } })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="email-provider" className="block text-sm font-bold text-gray-300">Provider</label>
              <select
                id="email-provider"
                value={config.emailSettings.provider}
                onChange={(e) => setConfig({ ...config, emailSettings: { ...config.emailSettings, provider: e.target.value } })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option>SendGrid</option>
                <option>Mailgun</option>
                <option>AWS SES</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => showToast("Test email sent (simulated).")}
              className="rounded-xl border border-white/10 px-5 py-2 text-sm font-bold text-gray-200 hover:bg-white/5"
            >
              Send Test Email
            </button>
          </div>
        </form>
      )}

      {activeTab === "Notifications" && (
        <div className="max-w-2xl rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <div className="space-y-4">
            {Object.entries(config.notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <p className="font-bold capitalize text-white">{key.replace(/([A-Z])/g, " $1")}</p>
                <Toggle
                  checked={value}
                  onChange={(v) =>
                    setConfig({ ...config, notificationSettings: { ...config.notificationSettings, [key]: v } })
                  }
                  label={`Toggle ${key} notifications`}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => saveConfig({ notificationSettings: config.notificationSettings })}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500"
          >
            Save Changes
          </button>
        </div>
      )}

      {activeTab === "SEO" && (
        <form
          className="max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-[#101a2f] p-6"
          onSubmit={(e) => {
            e.preventDefault();
            saveConfig({ seoDefaults: config.seoDefaults });
          }}
        >
          <div>
            <label htmlFor="seo-title" className="block text-sm font-bold text-gray-300">Default Title Template</label>
            <input
              id="seo-title"
              value={config.seoDefaults.title}
              onChange={(e) => setConfig({ ...config, seoDefaults: { ...config.seoDefaults, title: e.target.value } })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="seo-description" className="block text-sm font-bold text-gray-300">Default Description</label>
            <textarea
              id="seo-description"
              rows={3}
              value={config.seoDefaults.description}
              onChange={(e) => setConfig({ ...config, seoDefaults: { ...config.seoDefaults, description: e.target.value } })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="seo-keywords" className="block text-sm font-bold text-gray-300">Keywords (comma-separated)</label>
            <input
              id="seo-keywords"
              value={config.seoDefaults.keywords.join(", ")}
              onChange={(e) =>
                setConfig({
                  ...config,
                  seoDefaults: { ...config.seoDefaults, keywords: e.target.value.split(",").map((k) => k.trim()) },
                })
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="seo-og" className="block text-sm font-bold text-gray-300">OG Image URL</label>
            <input
              id="seo-og"
              value={config.seoDefaults.ogImage}
              onChange={(e) => setConfig({ ...config, seoDefaults: { ...config.seoDefaults, ogImage: e.target.value } })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="robots-txt" className="block text-sm font-bold text-gray-300">robots.txt</label>
            <textarea
              id="robots-txt"
              rows={4}
              defaultValue={"User-agent: *\nAllow: /"}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 font-mono text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500">
            Save Changes
          </button>
        </form>
      )}

      {activeTab === "Branding" && (
        <form
          className="max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-[#101a2f] p-6"
          onSubmit={(e) => {
            e.preventDefault();
            saveConfig({ logo: config.logo, favicon: config.favicon, primaryColor: config.primaryColor });
          }}
        >
          <div>
            <label htmlFor="logo-url" className="block text-sm font-bold text-gray-300">Logo URL</label>
            <input
              id="logo-url"
              value={config.logo}
              onChange={(e) => setConfig({ ...config, logo: e.target.value })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="favicon-url" className="block text-sm font-bold text-gray-300">Favicon URL</label>
            <input
              id="favicon-url"
              value={config.favicon}
              onChange={(e) => setConfig({ ...config, favicon: e.target.value })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="primary-color" className="block text-sm font-bold text-gray-300">Primary Color</label>
              <input
                id="primary-color"
                value={config.primaryColor}
                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="secondary-color" className="block text-sm font-bold text-gray-300">Secondary Color</label>
              <input
                id="secondary-color"
                defaultValue="#0b1526"
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500">
            Save Changes
          </button>
        </form>
      )}

      {activeTab === "Languages" && (
        <div className="max-w-2xl rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <div>
            <label htmlFor="default-lang" className="block text-sm font-bold text-gray-300">Default Language</label>
            <select
              id="default-lang"
              value={config.defaultLanguage}
              onChange={(e) => saveConfig({ defaultLanguage: e.target.value })}
              className="mt-1 w-full max-w-xs rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              {config.supportedLanguages.map((code) => (
                <option key={code} value={code}>
                  {LANGUAGE_NAMES[code] ?? code}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 space-y-3">
            {config.supportedLanguages.map((code) => (
              <div key={code} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <span className="font-bold text-white">{LANGUAGE_NAMES[code] ?? code}</span>
                <Toggle checked onChange={() => {}} label={`Toggle ${code} active`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Maintenance" && (
        <div className="max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <div className="flex items-center justify-between rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <div>
              <p className="font-black text-white">Maintenance Mode</p>
              <p className="text-sm text-yellow-400">⚠ Enabling this affects all visitors to the live site.</p>
            </div>
            <Toggle
              checked={config.maintenanceMode}
              onChange={(v) => {
                if (v) {
                  setMaintenanceConfirmOpen(true);
                } else {
                  saveConfig({ maintenanceMode: false });
                }
              }}
              label="Toggle maintenance mode"
            />
          </div>

          <div>
            <label htmlFor="maintenance-message" className="block text-sm font-bold text-gray-300">Maintenance Message</label>
            <textarea
              id="maintenance-message"
              rows={3}
              value={config.maintenanceMessage}
              onChange={(e) => setConfig({ ...config, maintenanceMessage: e.target.value })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="maintenance-schedule" className="block text-sm font-bold text-gray-300">
              Scheduled Maintenance
            </label>
            <input
              id="maintenance-schedule"
              type="datetime-local"
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => saveConfig({ maintenanceMessage: config.maintenanceMessage })}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Plan modal */}
      {planModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-modal-title"
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101a2f] p-6"
          >
            <h2 id="plan-modal-title" className="text-xl font-black text-white">
              {editingPlan ? "Edit Plan" : "Add Plan"}
            </h2>
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setPlanModalOpen(false);
                showToast(editingPlan ? "Plan updated." : "Plan created.");
              }}
            >
              <div>
                <label htmlFor="plan-name" className="block text-sm font-bold text-gray-300">Name</label>
                <input
                  id="plan-name"
                  defaultValue={editingPlan?.name ?? ""}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="plan-price" className="block text-sm font-bold text-gray-300">Price</label>
                  <input
                    id="plan-price"
                    type="number"
                    defaultValue={editingPlan?.price ?? 0}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="plan-cycle" className="block text-sm font-bold text-gray-300">Billing Cycle</label>
                  <select
                    id="plan-cycle"
                    defaultValue={editingPlan?.billingCycle ?? "monthly"}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="plan-features" className="block text-sm font-bold text-gray-300">
                  Features (one per line)
                </label>
                <textarea
                  id="plan-features"
                  rows={4}
                  defaultValue={editingPlan?.features.join("\n") ?? ""}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-6">
                <label htmlFor="plan-active" className="flex items-center gap-2 text-sm font-bold text-gray-300">
                  <input id="plan-active" type="checkbox" defaultChecked={editingPlan?.isActive ?? true} className="h-4 w-4 rounded border-white/20 bg-[#08101f]" />
                  Active
                </label>
                <label htmlFor="plan-popular" className="flex items-center gap-2 text-sm font-bold text-gray-300">
                  <input id="plan-popular" type="checkbox" defaultChecked={editingPlan?.isPopular ?? false} className="h-4 w-4 rounded border-white/20 bg-[#08101f]" />
                  Mark as Popular
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500">
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={maintenanceConfirmOpen}
        onClose={() => setMaintenanceConfirmOpen(false)}
        onConfirm={() => saveConfig({ maintenanceMode: true })}
        title="Enable maintenance mode?"
        message="This will immediately show a maintenance page to all visitors on the live site."
        confirmLabel="Enable Maintenance Mode"
        confirmVariant="warning"
      />
    </div>
  );
}
