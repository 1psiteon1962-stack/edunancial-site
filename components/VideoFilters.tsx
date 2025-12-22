// components/VideoFilters.tsx

import React from "react"
import { allRegions, levelLabels } from "@/data/videos"

export default function VideoFilters({
  level,
  region,
  onLevelChange,
  onRegionChange,
}: {
  level: any
  region: any
  onLevelChange: (value: any) => void
  onRegionChange: (value: any) => void
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        marginBottom: "1.5rem",
      }}
    >
      {/* Level Filter */}
      <label>
        Level:&nbsp;
        <select
          value={level ?? ""}
          onChange={(e) => onLevelChange(e.target.value)}
        >
          <option value="">All</option>
          {Object.entries(levelLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>

      {/* Region Filter */}
      <label>
        Region:&nbsp;
        <select
          value={region ?? ""}
          onChange={(e) => onRegionChange(e.target.value)}
        >
          <option value="">All</option>
          {allRegions.map((r: any) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
