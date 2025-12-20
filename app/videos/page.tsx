// app/videos/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { videos, type Level, type Region, levelLabels } from "@/data/videos";
import VideoCard from "@/components/VideoCard";
import VideoFilters from "@/components/VideoFilters";

export default function VideosPage() {
  // Default region can be changed later by query/cookie/header resolver.
  // For now: safe default to US.
  const [region, setRegion] = useState<Region>("us");
  const [level, setLevel] = useState<Level | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return videos
      .filter((v) => {
        // region match
        const isGlobal = v.regions.includes("global");
        const regionMatch = isGlobal || v.regions.includes(region);

        // level match
        const levelMatch = level === "all" ? true : v.level === level;

        // search match
        const searchMatch =
          q.length === 0
            ? true
            : v.title.toLowerCase().includes(q) ||
              v.summary.toLowerCase().includes(q) ||
              v.tags.some((t) => t.toLowerCase().includes(q));

        return regionMatch && levelMatch && searchMatch;
      })
      .sort((a, b) => {
        // newest first if dates exist, else keep stable
        const ad = a.published ? Date.parse(a.published) : 0;
        const bd = b.published ? Date.parse(b.published) : 0;
        return bd - ad;
      });
  }, [region, level, query]);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 60px" }}>
      <header style={{ display: "grid", gap: 10 }}>
        <h1 style={{ margin: 0, fontSize: 34, letterSpacing: "-0.02em" }}>Videos</h1>
        <p style={{ margin: 0, color: "rgba(0,0,0,0.75)", fontSize: 15, lineHeight: 1.5 }}>
          Financial literacy isn’t motivation. It’s clarity, structure, and repeatable decisions.
          Use the filters to follow your level path.
        </p>
      </header>

      <section style={{ marginTop: 16 }}>
        <VideoFilters
          region={region}
          setRegion={setRegion}
          level={level}
          setLevel={setLevel}
          query={query}
          setQuery={setQuery}
        />
      </section>

      <section style={{ marginTop: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div style={{ color: "rgba(0,0,0,0.7)", fontSize: 13 }}>
            Showing <b>{filtered.length}</b> video{filtered.length === 1 ? "" : "s"} for{" "}
            <b>{region.toUpperCase()}</b>
            {level === "all" ? "" : <> • <b>{levelLabels[level]}</b></>}
          </div>

          <button
            onClick={() => {
              setQuery("");
              setLevel("all");
            }}
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: 12,
              padding: "10px 12px",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Reset filters
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          {filtered.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>

        <div style={{ marginTop: 18, fontSize: 12, color: "rgba(0,0,0,0.65)" }}>
          Note: Video embeds are placeholders until you replace{" "}
          <code>PLACEHOLDER_VIDEO_ID</code> values inside <code>data/videos.ts</code>.
        </div>
      </section>
    </main>
  );
}
