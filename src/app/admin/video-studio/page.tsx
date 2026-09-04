import Link from "next/link";

import AutoNarrationBridge from "@/components/video-studio/AutoNarrationBridge";
import MarketingShortClient from "@/components/video-studio/MarketingShortClient";
import VideoStudioReadiness from "@/components/video-studio/VideoStudioReadiness";
import { requireAdminPageSession } from "@/lib/admin-content/auth";

export default async function VideoStudioPage() {
  await requireAdminPageSession();

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white">
      <AutoNarrationBridge />
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-300">Video Studio</p>
            <h1 className="mt-3 text-4xl font-black">Marketing Video Production</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Build 9:16 marketing videos from up to 30 artwork or video scenes with narration,
              transitions, text overlays, and optional background music. Render jobs are tracked
              through the private Edunancial video pipeline.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/dashboard" className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-slate-200 hover:border-white/30">
              Command Center
            </Link>
            <Link href="/admin/content/upload" className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-slate-200 hover:border-white/30">
              Bulk Content Upload
            </Link>
          </div>
        </div>

        <VideoStudioReadiness />

        <div className="mt-8">
          <MarketingShortClient />
        </div>
      </div>
    </main>
  );
}
