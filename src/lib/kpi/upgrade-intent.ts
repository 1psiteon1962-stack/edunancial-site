/**
 * Types for upgrade intent tracking
 */
export interface UpgradeIntentPayload {
  region: string;
  level: string;
  source?: string;
}

/**
 * ✅ FINAL IMPLEMENTATION
 * Matches what your component expects
 */
export async function recordUpgradeIntent(
  payload: UpgradeIntentPayload
): Promise<{ success: boolean }> {
  try {
    /**
     * You can replace this with your real API endpoint later
     */
    const response = await fetch("/api/kpi/upgrade-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to record upgrade intent");
    }

    return { success: true };
  } catch (error) {
    console.error("Upgrade intent error:", error);
    return { success: false };
  }
}
