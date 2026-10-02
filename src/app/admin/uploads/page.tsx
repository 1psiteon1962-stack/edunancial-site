import Link from "next/link";

import UploadClient from "@/components/admin-content/UploadClient";
import { requireAdminPageSession } from "@/lib/admin-content/auth";

export const dynamic = "force-dynamic";

export default async function UploadManagerPage() {
  await requireAdminPageSession();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-black uppercase tracking-[0.3em] text-yellow-400">Owner / Admin</p>
            <h1 className="text-4xl font-black sm:text-5xl">Bulk Content Upload</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Upload individual files or large ZIP packages for Courses or Marketplace. Files and ZIP packages use the protected admin-content upload path. Trusted complete curriculum packages are validated, published to the learner catalog, and exported to Git for durable canonical publication.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/curriculum" className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-slate-200 hover:border-white/30">
              Curriculum Dashboard
            </Link>
            <Link href="/admin/video" className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-500">
              Video Studio
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="font-black text-white">1. Upload</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Choose Courses, select the color and level, then upload one or many files or a ZIP package.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="font-black text-white">2. Review</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">The system stores, extracts, classifies, normalizes locale/track/level, and validates the package before trusted publication.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="font-black text-white">3. Publish</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Trusted complete curriculum packages publish to the live learner state and create the protected Git publication automatically. Other content continues through review.</p>
          </div>
        </div>

        <UploadClient />
      </section>
    </main>
  );
}
