export interface UpgradeIntentPayload {
  region: string;
  level: string;
  source?: string;
}

export async function recordUpgradeIntent(
  payload: UpgradeIntentPayload
): Promise<{ success: boolean }> {
  try {
    const res = await fetch("/api/kpi/upgrade-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return { success: res.ok };
  } catch (error) {
    console.error("Upgrade intent error:", error);
    return { success: false };
  }
}
