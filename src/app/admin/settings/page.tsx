import Link from "next/link";

import { requireAdminPageSession } from "@/lib/admin-content/auth";

export const metadata = { title: "Settings | Edunancial Admin" };

export default async function AdminSettingsPage() {
  const session = await requireAdminPageSession();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Admin</p>
        <h1 className="mt-2 text-4xl font-black">Settings</h1>

        <div className="mt-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-xl font-bold">Current Session</h2>
            <p className="mt-2 text-slate-400">
              Logged in as: <span className="font-semibold text-white">{session.email}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Session expires: {new Date(session.expiresAt).toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-xl font-bold">Administrator Credentials</h2>
            <p className="mt-2 text-slate-400">
              Admin credentials are set via environment variables. No credentials are
              stored in the database.
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-[#0a1020] p-4 font-mono text-sm text-slate-300">
              <p className="text-blue-300"># Required environment variables:</p>
              <p>EDUNANCIAL_ADMIN_EMAIL=admin@example.com</p>
              <p>EDUNANCIAL_ADMIN_PASSWORD_HASH=&lt;hash from setup script&gt;</p>
              <p>EDUNANCIAL_ADMIN_SESSION_SECRET=&lt;32+ char secret&gt;</p>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              See <code className="rounded bg-[#0a1020] px-1.5 py-0.5">docs/ADMINISTRATOR-GUIDE.md</code>{" "}
              and <code className="rounded bg-[#0a1020] px-1.5 py-0.5">docs/ENVIRONMENT-VARIABLES.md</code>{" "}
              for setup guidance.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-xl font-bold">Supported Roles</h2>
            <div className="mt-4 space-y-2">
              {[
                {
                  role: "admin",
                  desc: "Full access to all admin routes and settings",
                  access: "All admin routes",
                },
                {
                  role: "content_manager",
                  desc: "Can create and edit courses, media, and content",
                  access: "/admin/courses, /admin/media, /admin/content",
                },
                {
                  role: "instructor",
                  desc: "Future role: limited course editing",
                  access: "Read-only (future)",
                },
                {
                  role: "student",
                  desc: "Public website access only",
                  access: "Public routes",
                },
              ].map(({ role, desc, access }) => (
                <div
                  key={role}
                  className="flex items-start gap-4 rounded-xl border border-white/5 bg-[#0a1020] p-4"
                >
                  <span className="min-w-[120px] font-mono text-sm font-semibold text-blue-300">
                    {role}
                  </span>
                  <div>
                    <p className="text-sm text-white">{desc}</p>
                    <p className="text-xs text-slate-500">{access}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-xl font-bold">Documentation</h2>
            <div className="mt-4 flex gap-4">
              <Link
                href="/admin/dashboard"
                className="rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-300 hover:border-white/40"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
