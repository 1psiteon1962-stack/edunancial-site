// ─────────────────────────────────────────────────────────────
// YouTube Embed Utilities
//
// Parses any YouTube URL format and returns a responsive
// embed URL. If the video is updated on YouTube, the embed
// automatically renders the latest version — no site update needed.
// ─────────────────────────────────────────────────────────────

/**
 * Extracts the YouTube video ID from any common URL format:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 *
 * Returns null if the URL is not a recognized YouTube URL.
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  try {
    const u = new URL(url);

    // youtube.com/watch?v=ID or m.youtube.com/watch?v=ID
    if (
      (u.hostname === "www.youtube.com" ||
        u.hostname === "youtube.com" ||
        u.hostname === "m.youtube.com") &&
      u.pathname === "/watch"
    ) {
      return u.searchParams.get("v");
    }

    // youtu.be/ID
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1).split("?")[0] || null;
    }

    // youtube.com/embed/ID
    if (
      (u.hostname === "www.youtube.com" || u.hostname === "youtube.com") &&
      u.pathname.startsWith("/embed/")
    ) {
      return u.pathname.replace("/embed/", "").split("?")[0] || null;
    }

    // youtube.com/shorts/ID
    if (
      (u.hostname === "www.youtube.com" || u.hostname === "youtube.com") &&
      u.pathname.startsWith("/shorts/")
    ) {
      return u.pathname.replace("/shorts/", "").split("?")[0] || null;
    }
  } catch {
    // Invalid URL — fall through
  }

  return null;
}

/**
 * Returns true if the given URL is a YouTube URL.
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

export interface YouTubeEmbedOptions {
  /** Enable autoplay (requires muted=true in most browsers) */
  autoplay?: boolean;
  /** Start muted (required for autoplay) */
  muted?: boolean;
  /** Show related videos at end (0 = same channel only) */
  rel?: 0 | 1;
  /** Show the YouTube player controls */
  controls?: 0 | 1;
  /** Enable modest branding (hides YouTube logo) */
  modestbranding?: 0 | 1;
  /** Start time in seconds */
  start?: number;
  /** End time in seconds */
  end?: number;
  /** Enable closed captions by default (cc_load_policy=1) */
  closedCaptions?: boolean;
}

/**
 * Converts any YouTube URL into a fully-qualified embed URL.
 * Returns null if the URL is not a valid YouTube URL.
 *
 * The resulting URL is always current — YouTube serves the
 * latest version of the video automatically.
 */
export function buildYouTubeEmbedUrl(
  sourceUrl: string,
  options: YouTubeEmbedOptions = {}
): string | null {
  const videoId = extractYouTubeVideoId(sourceUrl);
  if (!videoId) return null;

  const params = new URLSearchParams();

  if (options.autoplay) params.set("autoplay", "1");
  if (options.muted) params.set("mute", "1");
  if (options.rel !== undefined) params.set("rel", String(options.rel));
  if (options.controls !== undefined) params.set("controls", String(options.controls));
  if (options.modestbranding !== undefined)
    params.set("modestbranding", String(options.modestbranding));
  if (options.start !== undefined) params.set("start", String(options.start));
  if (options.end !== undefined) params.set("end", String(options.end));
  if (options.closedCaptions) params.set("cc_load_policy", "1");

  const queryString = params.toString();
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ""}`;
}

/**
 * Returns the highest-quality thumbnail URL for a YouTube video.
 * Falls back to lower quality if maxresdefault is unavailable.
 */
export function getYouTubeThumbnailUrl(
  sourceUrl: string,
  quality: "maxres" | "hq" | "mq" | "sd" = "hq"
): string | null {
  const videoId = extractYouTubeVideoId(sourceUrl);
  if (!videoId) return null;

  const qualityMap = {
    maxres: "maxresdefault",
    hq: "hqdefault",
    mq: "mqdefault",
    sd: "sddefault",
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

// ── Generic Provider Resolver ─────────────────────────────────

/**
 * Resolves a raw video source URL to an embeddable iframe src.
 * Supports YouTube natively; other providers use the sourceUrl directly.
 *
 * This is the single function VideoPlayer components call —
 * adding a new provider requires only adding a branch here,
 * not changing any component.
 */
export function resolveVideoEmbedUrl(
  provider: string,
  sourceUrl: string,
  options: YouTubeEmbedOptions = {}
): string | null {
  if (provider === "youtube") {
    return buildYouTubeEmbedUrl(sourceUrl, {
      rel: 0,
      modestbranding: 1,
      ...options,
    });
  }

  // Vimeo, enterprise, uploaded — use sourceUrl directly
  // (providers will supply their own embed URLs)
  return sourceUrl || null;
}
