/**
 * LessonVideoPlayer
 *
 * Renders a responsive 16:9 YouTube embed using the privacy-enhanced
 * youtube-nocookie.com domain.  Supports lazy loading and fullscreen.
 */

import { getEmbedUrl } from "@/lib/youtube";

export interface LessonVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  description?: string;
  thumbnail?: string;
  length?: string;
}

interface LessonVideoPlayerProps {
  video: LessonVideo;
}

export default function LessonVideoPlayer({ video }: LessonVideoPlayerProps) {
  const embedSrc = getEmbedUrl(video.youtubeUrl);

  if (!embedSrc) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-white mb-3">{video.title}</h3>

      {/* 16:9 responsive wrapper */}
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingTop: "56.25%" }}>
        <iframe
          src={embedSrc}
          title={video.title}
          className="absolute inset-0 h-full w-full rounded-2xl border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {video.length && (
        <p className="mt-2 text-xs text-slate-500">Duration: {video.length}</p>
      )}
      {video.description && (
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">{video.description}</p>
      )}
    </div>
  );
}
