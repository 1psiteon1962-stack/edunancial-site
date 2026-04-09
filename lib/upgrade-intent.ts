export async function recordUpgradeIntent(
  region: string,
  level: string
): Promise<void> {
  console.log("Upgrade intent:", { region, level });
}
