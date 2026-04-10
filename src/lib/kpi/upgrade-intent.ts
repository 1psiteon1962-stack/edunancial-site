import { supabaseAdmin } from "./supabaseAdmin";

type UpgradeIntentPayload = {
  level: string;
  source?: string;
};

export async function recordUpgradeIntent(
  region: string,
  payload: UpgradeIntentPayload
) {
  const { error } = await supabaseAdmin.from("upgrade_intents").insert([
    {
      region,
      level: payload.level,
      source: payload.source || "unknown",
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Upgrade intent error:", error);
    return { success: false };
  }

  return { success: true };
}
