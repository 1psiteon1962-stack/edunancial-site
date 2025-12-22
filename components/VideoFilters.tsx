// components/VideoFilters.tsx

import React from "react"

const DEFAULT_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

const DEFAULT_REGIONS = [
  "Global",
  "USA",
  "Latin America",
  "Caribbean",
  "Africa",
  "Europe",
]

export default function VideoFilters({
  level,
  region,
  onLevelChange,
  onRegionChange,
}: {
  level: string | null
  region: string | null
  onLevelChange: (value: string) => void
  onRegionChange: (value: string) => void
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1.25rem",
        flexWrap: "wrap",
        marginBottom: "1.75rem",
      }}
    >
      {/* LEVEL FILTER */}
      <label>
        Level:&nbsp;
        <select
          value={level ?? ""}
          onChange={(e) => onLevelChange(e.target.value)}
        >
          <option value="">All</option>
          {DEFAULT_LEVELS.map((lvl) => (
            <option key={lvl.value} value={lvl.value}>
              {lvl.label}
            </option>
          ))}
        </select>
      </label>

      {/* REGION FILTER */}
      <label>
        Region:&nbsp;
        <select
          value={region ?? ""}
          onChange={(e) => onRegionChange(e.target.value)}
        >
          <option value="">All</option>
          {DEFAULT_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
