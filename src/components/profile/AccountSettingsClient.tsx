"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, validatePassword } from "@/lib/authContext";

export default function AccountSettingsClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("security");

  // Password change state
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState({
    courseUpdates: true,
    weeklyProgress: true,
    assessmentReminders: false,
    promotions: false,
    newsletter: true,
  });
  const [notifSaved, setNotifSaved] = useState(false);

  // Privacy state
  const [privacy, setPrivacy] = useState({
    profileVisible: false,
    shareProgress: false,
    allowAnalytics: true,
  });
  const [privacySaved, setPrivacySaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }

  const passwordErrors = validatePassword(pwForm.newPw);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (!pwForm.current) { setPwError("Please enter your current password."); return; }
    if (passwordErrors.length > 0) { setPwError("New password does not meet requirements."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError("New passwords do not match."); return; }
    setPwLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setPwLoading(false);
    setPwForm({ current: "", newPw: "", confirm: "" });
    setPwSaved(true);
  }

  async function handleNotifSave(e: React.FormEvent) {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 300));
    setNotifSaved(true);
  }

  async function handlePrivacySave(e: React.FormEvent) {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 300));
    setPrivacySaved(true);
  }

  const tabs = [
    { id: "security", label: "Password & Security" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy" },
    { id: "language", label: "Language" },
  ];

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 flex gap-2 text-sm text-slate-400">
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <span>/</span>
          <span className="text-white">Account Settings</span>
        </nav>

        <h1 className="text-4xl font-black">Account Settings</h1>
        <p className="mt-2 text-slate-400">
          Signed in as <span className="text-white">{user.email}</span>
        </p>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-700 pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-t-lg px-5 py-3 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold">Password & Security</h2>
              <p className="mt-2 text-sm text-slate-400">
                Keep your account secure with a strong password.
              </p>

              {pwSaved && (
                <div className="mt-4 rounded-lg border border-green-700 bg-green-950/40 px-4 py-3 text-sm text-green-300">
                  ✓ Password updated successfully.
                </div>
              )}
              {pwError && (
                <div className="mt-4 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                  {pwError}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="pw-current" className="mb-2 block text-sm font-semibold">
                    Current Password
                  </label>
                  <input
                    id="pw-current"
                    type="password"
                    value={pwForm.current}
                    onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="pw-new" className="mb-2 block text-sm font-semibold">
                    New Password
                  </label>
                  <input
                    id="pw-new"
                    type="password"
                    value={pwForm.newPw}
                    onChange={(e) => setPwForm((p) => ({ ...p, newPw: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                  {pwForm.newPw.length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs">
                      {[
                        "At least 12 characters",
                        "At least one uppercase letter",
                        "At least one lowercase letter",
                        "At least one number",
                        "At least one special character (!@#$%^&*)",
                      ].map((req) => {
                        const met = !passwordErrors.includes(req);
                        return (
                          <li key={req} className={met ? "text-green-400" : "text-slate-400"}>
                            {met ? "✓" : "○"} {req}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <div>
                  <label htmlFor="pw-confirm" className="mb-2 block text-sm font-semibold">
                    Confirm New Password
                  </label>
                  <input
                    id="pw-confirm"
                    type="password"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="rounded-xl bg-blue-600 px-8 py-3 font-bold hover:bg-blue-700 disabled:opacity-60"
                >
                  {pwLoading ? "Updating…" : "Update Password"}
                </button>
              </form>

              <hr className="my-8 border-slate-700" />

              <div>
                <h3 className="font-bold text-red-400">Danger Zone</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Permanently delete your account and all associated data.
                </p>
                <button className="mt-4 rounded-xl border border-red-700 px-6 py-2 text-sm font-bold text-red-400 hover:bg-red-900/30">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold">Notification Preferences</h2>
              <p className="mt-2 text-sm text-slate-400">
                Choose which notifications you'd like to receive.
              </p>
              {notifSaved && (
                <div className="mt-4 rounded-lg border border-green-700 bg-green-950/40 px-4 py-3 text-sm text-green-300">
                  ✓ Notification preferences saved.
                </div>
              )}
              <form onSubmit={handleNotifSave} className="mt-6 space-y-5">
                {[
                  { key: "courseUpdates", label: "Course Updates", desc: "Notify me when courses I'm enrolled in are updated." },
                  { key: "weeklyProgress", label: "Weekly Progress Report", desc: "Receive a weekly summary of your learning activity." },
                  { key: "assessmentReminders", label: "Assessment Reminders", desc: "Remind me to retake the assessment every 6 months." },
                  { key: "promotions", label: "Promotions & Offers", desc: "Receive special offers and membership promotions." },
                  { key: "newsletter", label: "Edunancial Newsletter", desc: "Financial competency tips and community news." },
                ].map(({ key, label, desc }) => (
                  <label key={key} className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof typeof notifications]}
                      onChange={(e) => setNotifications((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="mt-1 shrink-0"
                    />
                    <div>
                      <p className="font-semibold">{label}</p>
                      <p className="text-sm text-slate-400">{desc}</p>
                    </div>
                  </label>
                ))}
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-8 py-3 font-bold hover:bg-blue-700"
                >
                  Save Preferences
                </button>
              </form>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold">Privacy Settings</h2>
              <p className="mt-2 text-sm text-slate-400">
                Control your data and privacy preferences. We are committed to privacy-by-design and North American data protection standards.
              </p>
              {privacySaved && (
                <div className="mt-4 rounded-lg border border-green-700 bg-green-950/40 px-4 py-3 text-sm text-green-300">
                  ✓ Privacy settings saved.
                </div>
              )}
              <form onSubmit={handlePrivacySave} className="mt-6 space-y-5">
                {[
                  { key: "profileVisible", label: "Public Profile", desc: "Allow other members to view your public profile page." },
                  { key: "shareProgress", label: "Share Learning Progress", desc: "Allow Edunancial to display your progress in leaderboards." },
                  { key: "allowAnalytics", label: "Usage Analytics", desc: "Help us improve by sharing anonymized usage data." },
                ].map(({ key, label, desc }) => (
                  <label key={key} className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy[key as keyof typeof privacy]}
                      onChange={(e) => setPrivacy((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="mt-1 shrink-0"
                    />
                    <div>
                      <p className="font-semibold">{label}</p>
                      <p className="text-sm text-slate-400">{desc}</p>
                    </div>
                  </label>
                ))}
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-8 py-3 font-bold hover:bg-blue-700"
                >
                  Save Privacy Settings
                </button>
              </form>

              <hr className="my-6 border-slate-700" />
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-300">Data Requests (CCPA / PIPEDA)</p>
                <div className="flex flex-wrap gap-3">
                  <button className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:border-white">
                    Download My Data
                  </button>
                  <button className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:border-white">
                    Request Data Deletion
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Language Tab */}
          {activeTab === "language" && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold">Language & Region</h2>
              <p className="mt-2 text-sm text-slate-400">
                Set your preferred language for the platform.
              </p>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Interface Language</label>
                  <select className="w-full max-w-xs rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none">
                    <option value="en">English (United States)</option>
                    <option value="en-ca">English (Canada)</option>
                    <option value="fr">Français (Canada)</option>
                    <option value="es">Español</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Currency Display</label>
                  <select className="w-full max-w-xs rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none">
                    <option value="USD">USD – US Dollar</option>
                    <option value="CAD">CAD – Canadian Dollar</option>
                    <option value="GBP">GBP – British Pound</option>
                    <option value="EUR">EUR – Euro</option>
                  </select>
                </div>
                <button className="rounded-xl bg-blue-600 px-8 py-3 font-bold hover:bg-blue-700">
                  Save Language Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
