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
    const result = await recordUpgradeIntent({
      region,
      level,
      source: "button",
    });

    console.log("Upgrade intent recorded:", result);
  }

  return (
    <button type="button" onClick={handleClick}>
      Upgrade
    </button>
  );
}
