import Link from "next/link";

import MarketingShortClient from "@/components/video-studio/MarketingShortClient";
import { requireAdminPageSession } from "@/lib/admin-content/auth";

export default async function AdminVideoPage() {
  await requireAdminPageSession();

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-300">Video Studio R1</p>
            <h1 className="mt-3 text-4xl font-black">Create Marketing Short</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Turn existing artwork or a source video into a 9:16 MP4 for TikTok and YouTube Shorts. This workspace is additive and does not change curriculum, FIQ, membership, or public-site behavior.
            </p>
          </div>
          <Link href="/admin/content" className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-slate-200 hover:border-white/30">
            Back to admin
          </Link>
        </div>
        <div className="mt-8">
          <MarketingShortClient />
        </div>
      </div>
    </main>
  );
}
