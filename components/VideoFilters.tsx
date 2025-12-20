// components/VideoFilters.tsx
"use client";

import React from "react";
import type { Level, Region } from "@/data/videos";
import { allRegions, levelLabels } from "@/data/videos";

type Props = {
  region: Region;
  setRegion: (r: Region) => void;
  level: Level | "all";
  setLevel: (l: Level | "all") => void;
  query: string;
  setQuery: (q: string) => void;
};

export default function VideoFilters({ region, setRegion, level, setLevel, query, setQuery }: Props) {
  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 14,
        padding: 14,
        background: "#fff",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 2fr",
        gap: 10,
      }}
    >
      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontSize: 12, color: "rgba(0,0,0,0.7)", fontWeight: 700 }}>Region</span>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value as Region)}
          style={{
            borderRadius: 12,
            padding: "10px 12px",
            border: "1px solid rgba(0,0,0,0.15)",
            background: "#fff",
          }}
        >
          {allRegions.map((r) => (
            <option key={r} value={r}>
              {r.toUpperCase()}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontSize: 12, color: "rgba(0,0,0,0.7)", fontWeight: 700 }}>Level</span>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value === "all" ? "all" : (Number(e.target.value) as Level))}
          style={{
            borderRadius: 12,
            padding: "10px 12px",
            border: "1px solid rgba(0,0,0,0.15)",
            background: "#fff",
          }}
        >
          <option value="all">All Levels</option>
          <option value="1">{levelLabels[1]}</option>
          <option value="2">{levelLabels[2]}</option>
          <option value="3">{levelLabels[3]}</option>
          <option value="4">{levelLabels[4]}</option>
          <option value="5">{levelLabels[5]}</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontSize: 12, color: "rgba(0,0,0,0.7)", fontWeight: 700 }}>
          Search (title / tags)
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search: cashflow, ownership, KPI..."
          style={{
            borderRadius: 12,
            padding: "10px 12px",
            border: "1px solid rgba(0,0,0,0.15)",
          }}
        />
      </label>
    </div>
  );
}
