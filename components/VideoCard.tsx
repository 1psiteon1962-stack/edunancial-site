// components/VideoCard.tsx

import { useMemo } from "react"

export default function VideoCard({ video }: { video: any }) {
  const safeEmbedUrl = useMemo(() => {
    if (!video?.embedUrl) return ""

    if (typeof video.embedUrl !== "string") return ""

    if (video.embedUrl.includes("youtube.com/embed/")) return video.embedUrl
    if (video.embedUrl.includes("player.vimeo.com/video/")) return video.embedUrl

    return ""
  }, [video])

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <h3>{video?.title ?? "Untitled Video"}</h3>

      {safeEmbedUrl ? (
        <iframe
          src={safeEmbedUrl}
          width="100%"
          height="315"
          style={{ border: "none", marginTop: "0.75rem" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <p style={{ fontStyle: "italic", marginTop: "0.75rem" }}>
          Video embed coming soon.
        </p>
      )}
    </div>
  )
}
