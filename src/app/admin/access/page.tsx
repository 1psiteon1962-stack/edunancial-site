import Link from "next/link";

export const metadata = {
  title: "Admin Access Required | Edunancial",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAccessPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-20 text-white">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">
          Restricted Area
        </p>
        <h1 className="mt-4 text-4xl font-black">Admin access is protected.</h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">
          The production hardening pass now requires a valid administrator access
          token before admin dashboards are served.
        </p>
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-slate-300">
          <p>
            To continue, open the requested admin URL with the configured{" "}
            <code className="rounded bg-slate-800 px-2 py-1">?access=</code>{" "}
            token once, or send the{" "}
            <code className="rounded bg-slate-800 px-2 py-1">x-admin-token</code>{" "}
            header from an internal tool.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500"
          >
            Return home
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-200 hover:border-slate-400 hover:text-white"
          >
            Request access
          </Link>
        </div>
      </div>
    </main>
  );
}
