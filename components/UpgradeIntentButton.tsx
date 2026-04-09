"use client";

import { recordUpgradeIntent } from "@/lib/upgrade-intent";

interface Props {
  region: string;
  level: string;
}

export default function UpgradeIntentButton({ region, level }: Props) {
  async function handleClick() {
    const result = await recordUpgradeIntent(region, {
      level,
      source: "button",
    });

    if (result.success) {
      console.log("Upgrade intent recorded");
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "0.75rem 1.25rem",
        cursor: "pointer",
      }}
    >
      Upgrade
    </button>
  );
}
