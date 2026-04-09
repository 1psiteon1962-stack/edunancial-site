export type UpgradeIntentInput = {
  region: string
  level: string
  source?: string
}

export type UpgradeIntentResult = {
  success: boolean
}

/**
 * Records user upgrade intent.
 * This will later connect to:
 * - database (Supabase / Firebase)
 * - CRM (MailerLite, HubSpot)
 * - analytics (conversion tracking)
 */
export async function recordUpgradeIntent(
  input: UpgradeIntentInput
): Promise<UpgradeIntentResult> {
  try {
    // For now, just log (safe for build + runtime)
    console.log("Upgrade intent recorded:", {
      region: input.region,
      level: input.level,
      source: input.source ?? "unknown",
      timestamp: new Date().toISOString(),
    })

    // Future: send to API / DB here

    return { success: true }
  } catch (error) {
    console.error("Upgrade intent failed:", error)

    return { success: false }
  }
}
