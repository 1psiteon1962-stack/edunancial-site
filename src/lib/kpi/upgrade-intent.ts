export interface UpgradeIntentPayload {
  region: string;
  level: string;
  source?: string;
}

export interface UpgradeIntentResponse {
  success: boolean;
}

export async function recordUpgradeIntent(
  payload: UpgradeIntentPayload
): Promise<UpgradeIntentResponse> {
  try {
    const response = await fetch("/api/kpi/upgrade-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return {
      success: response.ok,
    };
  } catch (error) {
    console.error("recordUpgradeIntent error:", error);
    return {
      success: false,
    };
  }
}
