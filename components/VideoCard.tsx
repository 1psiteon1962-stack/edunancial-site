// components/VideoCard.tsx
"use client";

import React, { useMemo, useState } from "react";
import type { VideoItem } from "@/data/videos";

type Props = {
  video: VideoItem;
};

export default function VideoCard({ video }: Props) {
  const [open, setOpen] = useState(false);

  const safeEmbedUrl = useMemo(() => {
    // Minimal sanity check to avoid broken embeds
    if (!video.embedUrl) return "";
    if (video.embedUrl.includes("youtube.com/embed/")) return video.embedUrl;
    if (video.embedUrl.includes("player.vimeo.com/video/")) return video.embedUrl;
    // allow placeholder text but keep it from rendering as iframe
    return "";
  }, [video.embedUrl]);

  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 14,
        padding: 16,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div
          style={{
            width: 180,
            height: 100,
            borderRadius: 12,
            background: "rgba(0,0,0,0.06)",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "rgba(0,0,0,0.55)",
          }}
        >
          {video.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            "Thumbnail placeholder"
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.2 }}>{video.title}</h3>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
              {video.minutes} min
            </div>
          </div>

          <div style={{ marginTop: 6, fontSize: 13, color: "rgba(0,0,0,0.72)" }}>
            {video.summary}
          </div>

          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
            <span
              style={{
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.06)",
              }}
            >
              Level {video.level}
            </span>
            {video.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 999,
                  background: "rgba(0,0,0,0.06)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => setOpen((v) => !v)}
              style={{
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: 12,
                padding: "10px 12px",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {open ? "Hide video" : "Watch"}
            </button>

            <button
              onClick={() => {
                // Placeholder: later wire into member save/bookmark
                alert("Saved (placeholder). Wire to member profile later.");
              }}
              style={{
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: 12,
                padding: "10px 12px",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 14 }}>
          {safeEmbedUrl ? (
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <iframe
                src={safeEmbedUrl}
                title={video.title}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                  borderRadius: 14,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              style={{
                border: "1px dashed rgba(0,0,0,0.25)",
                borderRadius: 14,
                padding: 16,
                color: "rgba(0,0,0,0.7)",
                background: "rgba(0,0,0,0.03)",
              }}
            >
              Video embed placeholder. Replace <b>embedUrl</b> in <code>data/videos.ts</code>{" "}
              with a real YouTube/Vimeo embed URL.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
