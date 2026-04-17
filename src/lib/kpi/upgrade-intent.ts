export interface UpgradeIntentPayload {
  region: string;
  level: string;
  source?: string;
}

export async function recordUpgradeIntent(
  payload: UpgradeIntentPayload
): Promise<{ success: boolean }> {
  try {
    // 🔒 SAFE NO-FAIL IMPLEMENTATION
    // (You can later replace with real API call)

    console.log("Upgrade intent recorded:", payload);

    return { success: true };
  } catch (error) {
    console.error("Error recording upgrade intent:", error);
    return { success: false };
  }
}
