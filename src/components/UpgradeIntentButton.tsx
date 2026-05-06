"use client";

interface UpgradeIntentButtonProps {
  region: string;
  level: string;
  source?: string;
  className?: string;
  children?: React.ReactNode;
}

async function recordUpgradeIntent(params: {
  region: string;
  level: string;
  source: string;
}) {
  try {
    await fetch("/api/kpi/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_name: "upgrade_intent",
        event_type: "button_click",
        metadata: {
          region: params.region,
          level: params.level,
          source: params.source,
        },
      }),
    });

    return { success: true };
  } catch (error) {
    console.warn("Upgrade intent tracking failed:", error);
    return { success: false };
  }
}

export default function UpgradeIntentButton({
  region,
  level,
  source = "button",
  className,
  children = "Upgrade",
}: UpgradeIntentButtonProps) {
  async function handleClick() {
    await recordUpgradeIntent({
      region,
      level,
      source,
    });
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
