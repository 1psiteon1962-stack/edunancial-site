"use client";

// ─────────────────────────────────────────────────────────────
// VideoPlayer — Responsive, provider-agnostic video embed.
//
// Supports YouTube now; designed for Vimeo, enterprise hosting,
// live webinars, and premium libraries without redesign.
//
// YouTube embed links stay current automatically — if the video
// is updated on YouTube, the player renders the latest version.
// ─────────────────────────────────────────────────────────────

import { resolveVideoEmbedUrl } from "@/lib/video-learning/youtube";
import type { VideoConfig } from "@/lib/video-learning/types";

interface VideoPlayerProps {
  video: VideoConfig;
  /** Lesson title used as the iframe accessibility label */
  title: string;
  className?: string;
}

export default function VideoPlayer({ video, title, className = "" }: VideoPlayerProps) {
  const embedUrl = resolveVideoEmbedUrl(video.provider, video.sourceUrl, {
    rel: 0,
    modestbranding: 1,
    closedCaptions: video.closedCaptionsAvailable,
  });

  if (!embedUrl) {
    return (
      <div
        className={`aspect-video w-full rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center ${className}`}
      >
        <p className="text-slate-500 text-sm">Video unavailable. Check the source URL.</p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl ${className}`}
      style={{ paddingBottom: "56.25%" /* 16:9 */ }}
    >
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}

// ── Convenience wrapper for legacy videoUrl string ─────────────

interface LegacyVideoPlayerProps {
  videoUrl: string;
  title: string;
  closedCaptions?: boolean;
  className?: string;
}

/**
 * Accepts a raw YouTube URL or embed URL string.
 * Use this when migrating from the legacy `lesson.videoUrl` field.
 */
export function LegacyVideoPlayer({
  videoUrl,
  title,
  closedCaptions = false,
  className,
}: LegacyVideoPlayerProps) {
  const config: VideoConfig = {
    provider: "youtube",
    sourceUrl: videoUrl,
    closedCaptionsAvailable: closedCaptions,
  };
  return <VideoPlayer video={config} title={title} className={className} />;
}
