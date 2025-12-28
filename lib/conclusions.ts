import { MetricEvent } from "./metrics";
import { Region } from "./core";
import { Membership } from "./membership";

/**
 * A single conclusion generated from metrics
 */
export type Conclusion = {
  region: Region;
  score: number;
  summary: string;
  membership: Membership;
};

/**
 * Very simple scoring logic for now.
 * This can be expanded later without breaking types.
 */
export function deriveConclusion(
  region: Region,
  events: MetricEvent[]
): Conclusion {
  let score = 0;

  for (const e of events) {
    if (e.name === "page_view") score += 1;
    if (e.name === "cta_click") score += 5;
  }

  let membership: Membership = "FREE";
  let summary = "Getting started";

  if (score >= 20) {
    membership = "PRO";
    summary = "High engagement detected";
  } else if (score >= 10) {
    membership = "BASIC";
    summary = "Moderate engagement detected";
  }

  return {
    region,
    score,
    summary,
    membership,
  };
}
