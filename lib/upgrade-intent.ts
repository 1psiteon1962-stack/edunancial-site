export type UpgradeIntentPayload = {
  level: string;
  source?: string;
};

export type UpgradeIntentResult = {
  success: boolean;
};

export async function recordUpgradeIntent(
  region: string,
  payload: UpgradeIntentPayload
): Promise<UpgradeIntentResult> {
  try {
    console.log("Upgrade intent:", {
      region,
      ...payload,
      timestamp: new Date().toISOString(),
    });

    // Future: send to API / database

    return { success: true };
  } catch (error) {
    console.error("Upgrade intent failed:", error);
    return { success: false };
  }
}
