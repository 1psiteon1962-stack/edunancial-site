"use client";

/**
 * 🚨 CRITICAL FIX
 * RELATIVE IMPORT — removes ALL alias issues on Netlify
 */
import { recordUpgradeIntent } from "../../lib/kpi/upgradeIntent";

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

    console.log(result);
  }

  return (
    <button type="button" onClick={handleClick}>
      Upgrade
    </button>
  );
}
