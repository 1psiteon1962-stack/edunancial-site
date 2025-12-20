"use client";

import { recordUpgradeIntent } from "@/lib/upgrade-intent";

interface Props {
  region: string;
  currentLevel: "level_1" | "level_2" | "level_3" | "level_4" | "level_5";
  targetLevel: "level_2" | "level_3" | "level_4" | "level_5";
  label?: string;
}

export default function UpgradeIntentButton({
  region,
  currentLevel,
  targetLevel,
  label = "Upgrade Interest",
}: Props) {
  return (
    <button
      onClick={() =>
        recordUpgradeIntent({
          region,
          currentLevel,
          targetLevel,
          source: "button",
          timestamp: Date.now(),
        })
      }
      style={{
        marginTop: "1rem",
        padding: "0.6rem 1rem",
        borderRadius: "6px",
        border: "1px solid #999",
        background: "#f5f5f5",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
