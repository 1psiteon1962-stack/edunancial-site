export interface UpgradeIntentPayload {
  region: string;
  level: string;
  source?: string;
}

export async function recordUpgradeIntent(
  payload: UpgradeIntentPayload
): Promise<{ success: boolean }> {
  try {
    const response = await fetch("/api/kpi/upgrade-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed request");
    }

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}
