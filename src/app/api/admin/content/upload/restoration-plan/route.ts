import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getRecoverableCurriculumPackages } from "@/lib/admin-content/recovery-discovery";
import { buildRestorationPlan, type RestorationGap } from "@/lib/admin-content/restoration-plan";
import { selectExistingRestorationCandidates } from "@/lib/admin-content/restoration-execution";
import { verifyExistingRestorationPackages } from "@/lib/admin-content/restoration-verification";
import { orderVerifiedRestorationPackages } from "@/lib/admin-content/restoration-order";
import { assessRestorationExecutionReadiness } from "@/lib/admin-content/restoration-readiness";
import { buildRestorationExecutionManifest } from "@/lib/admin-content/restoration-execution-manifest";
import { buildRestorationExecutionSteps } from "@/lib/admin-content/restoration-execution-runner";
import { listRestorationCoordinates } from "@/lib/curriculum/restoration-matrix";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Read-only global restoration planner. It deliberately covers every centrally
 * configured track x L1-L5 x locale coordinate, including coordinates that
 * currently have no canonical registry assets. Future centrally configured
 * locales therefore enter the plan without restoration-specific code.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;

  const packages = await getRecoverableCurriculumPackages();
  const coordinates = listRestorationCoordinates();
  const executionCandidates = selectExistingRestorationCandidates(packages);
  const verification = verifyExistingRestorationPackages(packages);
  const restorationOrder = orderVerifiedRestorationPackages(verification);
  const executionReadiness = await assessRestorationExecutionReadiness(restorationOrder);
  const executionManifest = buildRestorationExecutionManifest(executionReadiness);
  const executionSteps = buildRestorationExecutionSteps(executionManifest);
  const packageKeys = new Set(packages.flatMap((candidate) => candidate.reconciliationKey ? [candidate.reconciliationKey] : []));
  const gaps: RestorationGap[] = coordinates.map((coordinate) => {
    const level = Number(coordinate.level.replace("level-", ""));
    const key = `${coordinate.track.toUpperCase()}:L${level}:${coordinate.locale}`;
    return {
      track: coordinate.track,
      level,
      locale: coordinate.locale,
      // This endpoint does not claim canonical completeness. Coordinates with
      // a recoverable package are candidates; all others remain unresolved
      // until canonical gap evidence is joined by the restoration executor.
      classification: packageKeys.has(key) ? "missing-canonical" : "unresolved",
    };
  });
  const plan = buildRestorationPlan(gaps, packages);

  return Response.json({
    success: true,
    readOnly: true,
    matrixCoordinates: coordinates.length,
    recoverablePackages: packages.length,
    currentRecoveryScope: "existing-l1-l3",
    executionCandidates,
    verification,
    readyExistingL1L3: verification.filter((entry) => entry.status === "ready-single-package"),
    restorationOrder,
    canonicalReady: restorationOrder.filter((entry) => entry.phase === "canonical"),
    localizedReady: restorationOrder.filter((entry) => entry.phase === "localized" && !entry.blockedByCanonical),
    localizedBlockedByCanonical: restorationOrder.filter((entry) => entry.phase === "localized" && entry.blockedByCanonical),
    executionReadiness,
    executionManifest,
    executionSteps,
    executionReady: executionReadiness.filter((entry) => entry.executionReady),
    executionBlocked: executionReadiness.filter((entry) => !entry.executionReady),
    restorable: plan.restorable,
    unresolved: plan.unresolved,
    conflicts: plan.conflicts,
    unmatchedPackages: plan.unmatchedPackages,
  }, { headers: { "Cache-Control": "private, no-store" } });
}
