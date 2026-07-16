"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";

const COUNTRIES = [
  "United States", "Canada", "Mexico", "United Kingdom", "Australia",
  "Nigeria", "Ghana", "Jamaica", "Trinidad and Tobago", "Barbados", "Other",
];

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  basic: "Basic",
  premium: "Premium",
  enterprise: "Enterprise",
};

export default function ProfileClient() {
  const { user, loading, updateProfile, logout } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    bio: "",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ?? "",
        country: user.country ?? "",
        bio: user.biography ?? "",
      });
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      country: form.country,
      biography: form.bio,
    });
    setSaving(false);
    setSaved(true);
  }

  const joinedDate = new Date(user.joinedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <nav className="mb-8 flex gap-2 text-sm text-slate-400">
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <span>/</span>
          <span className="text-white">My Profile</span>
        </nav>

        <h1 className="text-4xl font-black">My Profile</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-700 text-3xl font-black">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <h2 className="mt-4 text-xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="mt-1 text-sm text-slate-400">{user.email}</p>
              <p className="mt-3 inline-block rounded-full bg-blue-800/40 px-3 py-1 text-xs font-semibold text-blue-300">
                {TIER_LABELS[user.membershipTier] ?? user.membershipTier} Member
              </p>
              <p className="mt-3 text-xs text-slate-500">Member since {joinedDate}</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-300">
                Quick Links
              </h3>
              <nav className="space-y-2">
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Course Progress", href: "/course-progress" },
                  { label: "My Certificates", href: "/my-certificates" },
                  { label: "Membership", href: "/membership" },
                  { label: "Account Settings", href: "/settings" },
                ].map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <hr className="my-4 border-slate-700" />
              <button
                onClick={logout}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Main form */}
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <p className="mt-1 text-sm text-slate-400">
                Update your name, location, and public profile.
              </p>

              {saved && (
                <div className="mt-4 rounded-lg border border-green-700 bg-green-950/40 px-4 py-3 text-sm text-green-300">
                  ✓ Profile updated successfully.
                </div>
              )}

              <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="prof-first" className="mb-2 block text-sm font-semibold">
                      First Name
                    </label>
                    <input
                      id="prof-first"
                      type="text"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="prof-last" className="mb-2 block text-sm font-semibold">
                      Last Name
                    </label>
                    <input
                      id="prof-last"
                      type="text"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-400">
                    Email Address <span className="text-xs">(cannot be changed)</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-slate-800 bg-slate-900 p-3 text-slate-500"
                  />
                </div>

                <div>
                  <label htmlFor="prof-phone" className="mb-2 block text-sm font-semibold">
                    Phone Number
                  </label>
                  <input
                    id="prof-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="prof-country" className="mb-2 block text-sm font-semibold">
                    Country
                  </label>
                  <select
                    id="prof-country"
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="prof-bio" className="mb-2 block text-sm font-semibold">
                    Short Bio{" "}
                    <span className="text-xs text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    id="prof-bio"
                    rows={3}
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value)}
                    placeholder="Tell us about your financial goals…"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-8 py-3 font-bold hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold">Membership</h2>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    {TIER_LABELS[user.membershipTier] ?? user.membershipTier} Plan
                  </p>
                  <p className="text-sm text-slate-400">Active since {joinedDate}</p>
                </div>
                <Link
                  href="/membership"
                  className="rounded-xl border border-yellow-500 px-5 py-2 text-sm font-bold text-yellow-400 hover:bg-yellow-600 hover:text-white"
                >
                  {user.membershipTier === "free" ? "Upgrade" : "Manage"}
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold">Financial Competency Assessment</h2>
              {user.assessmentCompleted ? (
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-black text-blue-400">
                      {user.overallScore ?? "—"}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">Overall Score</p>
                  </div>
                  <Link
                    href="/assessment"
                    className="rounded-xl border border-white px-5 py-2 text-sm font-bold hover:bg-white hover:text-black"
                  >
                    Retake
                  </Link>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-slate-400">You haven't completed the assessment yet.</p>
                  <Link
                    href="/assessment"
                    className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700"
                  >
                    Take Free Assessment →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
