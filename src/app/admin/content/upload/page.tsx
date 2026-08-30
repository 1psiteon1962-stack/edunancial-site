import Link from "next/link";

import DiagnosticsPanel from "@/components/admin-content/DiagnosticsPanel";
import RecoveryClient from "@/components/admin-content/RecoveryClient";
import ResilientUploadClient from "@/components/admin-content/ResilientUploadClient";
import { requireAdminPageSession } from "@/lib/admin-content/auth";

export default async function AdminContentUploadPage() {
  await requireAdminPageSession();
  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Step 1</p>
            <h1 className="mt-3 text-4xl font-black">Upload content for review</h1>
            <p className="mt-3 max-w-3xl text-slate-300">Files are validated, safely extracted, classified, and staged for explicit approval. Nothing is published automatically.</p>
          </div>
          <Link href="/admin/content" className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-slate-200 hover:border-white/30">Back to portal</Link>
        </div>
        <div className="mt-8"><DiagnosticsPanel /></div>
        <div className="mt-8"><RecoveryClient /></div>
        <div className="mt-8"><ResilientUploadClient /></div>
      </div>
    </main>
  );
}
