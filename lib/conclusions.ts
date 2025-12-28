import { MetricEvent } from "./metrics";
import { Region } from "./core";
import { Membership } from "./membership";
import { memberships } from "@/data/memberships";

/**
 * A conclusion derived from engagement metrics
 */
export type Conclusion = {
  region: Region;
  score: number;
  summary: string;
  membership: Membership;
};

/**
 * Determine the appropriate membership based on score
 */
function resolveMembership(score: number): Membership {
  if (score >= 20) {
    return memberships.find(m => m.slug === "pro") ?? memberships[0];
  }

  if (score >= 10) {
    return memberships.find(m => m.slug === "basic") ?? memberships[0];
  }

  return memberships.find(m => m.slug === "free") ?? memberships[0];
}

/**
 * Generate a conclusion from metric events
 */
export function deriveConclusion(
  region: Region,
  events: MetricEvent[]
): Conclusion {
  let score = 0;

  for (const event of events) {
    if (event.name === "page_view") score += 1;
    if (event.name === "cta_click") score += 5;
  }

  const membership = resolveMembership(score);

  const summary =
    score >= 20
      ? "High engagement detected"
      : score >= 10
      ? "Moderate engagement detected"
      : "Getting started";

  return {
    region,
    score,
    summary,
    membership,
  };
}
