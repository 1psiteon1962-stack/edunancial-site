"use client";

import { recordUpgradeIntent } from "@/lib/kpi/upgradeIntent";

interface UpgradeIntentButtonProps {
  region: string;
  level: string;
}

export default function UpgradeIntentButton({
  region,
  level,
}: UpgradeIntentButtonProps) {
  async function handleClick() {
    try {
      await recordUpgradeIntent({
        region,
        level,
        source: "button",
      });
    } catch (err) {
      console.error("Upgrade intent failed", err);
    }
  }

  return (
    <button onClick={handleClick}>
      Upgrade
    </button>
  );
}
