import type { RestorationVerification } from "@/lib/admin-content/restoration-verification";

const CANONICAL_ENGLISH = new Set(["en", "en-US"]);

export type OrderedRestorationPackage = {
  reconciliationKey: string;
  verification: RestorationVerification;
  phase: "canonical" | "localized";
  blockedByCanonical: boolean;
  canonicalKey: string;
};

/**
 * Produces a deterministic canonical-first order for the exact verified L1-L3
 * restoration set. Localized packages are never represented as independent
 * prerequisites: their canonical coordinate is explicit and sorts first when
 * a stored canonical package is available.
 */
export function orderVerifiedRestorationPackages(
  verification: RestorationVerification[],
): OrderedRestorationPackage[] {
  const ready = verification.filter((entry) => entry.status === "ready-single-package");
  const canonicalKeys = new Set(
    ready
      .filter((entry) => entry.package.identity && CANONICAL_ENGLISH.has(entry.package.identity.language))
      .map((entry) => {
        const identity = entry.package.identity!;
        return `${identity.track.toUpperCase()}:L${identity.level.replace("level-", "")}:en-US`;
      }),
  );

  return ready.map((entry) => {
    const identity = entry.package.identity!;
    const canonicalKey = `${identity.track.toUpperCase()}:L${identity.level.replace("level-", "")}:en-US`;
    const canonical = CANONICAL_ENGLISH.has(identity.language);
    return {
      reconciliationKey: entry.reconciliationKey,
      verification: entry,
      phase: canonical ? "canonical" : "localized",
      blockedByCanonical: !canonical && !canonicalKeys.has(canonicalKey),
      canonicalKey,
    } satisfies OrderedRestorationPackage;
  }).sort((a, b) =>
    Number(a.phase === "localized") - Number(b.phase === "localized")
    || a.canonicalKey.localeCompare(b.canonicalKey)
    || a.reconciliationKey.localeCompare(b.reconciliationKey),
  );
}
