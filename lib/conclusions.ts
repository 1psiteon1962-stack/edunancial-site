import { MetricEvent } from "./metrics";
import { Region } from "./core";
import { Membership } from "./membership";

/**
 * Canonical membership objects
 * (inline to avoid missing data imports)
 */
const FREE_MEMBERSHIP: Membership = {
  id: "free",
  name: "Free",
  price: 0,
  features: [],
};

const BASIC_MEMBERSHIP: Membership = {
  id: "basic",
  name: "Basic",
  price: 19,
  features: [],
};

const PRO_MEMBERSHIP: Membership = {
  id: "pro",
  name: "Pro",
  price: 49,
  features: [],
};

export type Conclusion = {
  region: Region;
  score: number;
  summary: string;
  membership: Membership;
};

function resolveMembership(score: number): Membership {
  if (score >= 20) return PRO_MEMBERSHIP;
  if (score >= 10) return BASIC_MEMBERSHIP;
  return FREE_MEMBERSHIP;
}

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
