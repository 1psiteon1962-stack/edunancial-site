/**
 * YouTube URL utilities
 *
 * Supports the following URL formats:
 *   https://youtu.be/{id}
 *   https://www.youtube.com/watch?v={id}
 *   https://www.youtube.com/embed/{id}
 *   https://www.youtube.com/shorts/{id}
 */

export function getYoutubeId(url: string): string {
  if (!url) return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/,
  );
  return match ? match[1] : "";
}

/** @deprecated Use getYoutubeId */
export function youtubeId(url: string): string {
  return getYoutubeId(url);
}

/**
 * Returns a privacy-enhanced embed URL using youtube-nocookie.com.
 */
export function getEmbedUrl(url: string): string {
  const id = getYoutubeId(url);
  if (!id) return "";
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

/** @deprecated Use getEmbedUrl */
export function embedUrl(url: string): string {
  return getEmbedUrl(url);
}

export function thumbnail(url: string): string {
  const id = getYoutubeId(url);
  if (!id) return "";
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

