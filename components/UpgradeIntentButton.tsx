"use client";

/**
 * FINAL — CORRECT IMPORT
 * USE ROOT-RELATIVE PATH FROM PROJECT
 */
import { recordUpgradeIntent } from "src/lib/kpi/upgradeIntent";

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

    console.log("Upgrade intent result:", result);
  }

  return (
    <button type="button" onClick={handleClick}>
      Upgrade
    </button>
  );
}
