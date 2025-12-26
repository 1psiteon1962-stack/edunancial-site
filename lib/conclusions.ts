// lib/conclusions.ts
import { MetricEvent } from "./metrics";
import { Region } from "./core";
import { MembershipLevel } from "./membership";

export type Conclusion = {
  region: Region;
  userStage: "visitor" | "engaged" | "executor" | "converter";
  recommendedAction: string;
  recommendedModule: string;
  upsellLevel?: MembershipLevel;
};

function count(events: MetricEvent[], name: MetricEvent["name"]) {
  return events.filter((e) => e.name === name).length;
}

export function deriveConclusion(
  region: Region,
  events: MetricEvent[]
): Conclusion {
  const pageViews = count(events, "page_view");
  const ctaClicks = count(events, "cta_click");
  const cashflow = count(events, "cashflow_submit");
  const modules = count(events, "module_open");

  let stage: Conclusion["userStage"] = "visitor";

  if (ctaClicks > 0) stage = "engaged";
  if (cashflow > 0 || modules > 1) stage = "executor";
  if (cashflow > 0 && modules > 2) stage = "converter";

  // REGION-SPECIFIC LOGIC
  if (region === "AFRICA") {
    return {
      region,
      userStage: stage,
      recommendedAction:
        stage === "visitor"
          ? "Identify 1 income-producing task you can execute in 7 days"
          : stage === "engaged"
          ? "Complete Cash-Flow Mapper and select one offer"
          : "Execute outreach: 10 messages today",
      recommendedModule:
        stage === "visitor"
          ? "Cash Survival Framework"
          : "Micro-Enterprise Execution",
      upsellLevel: stage === "converter" ? "Foundation" : undefined,
    };
  }

  if (region === "LATAM") {
    return {
      region,
      userStage: stage,
      recommendedAction:
        stage === "visitor"
          ? "Protect your income source before scaling"
          : stage === "engaged"
          ? "Map risk points and dependencies"
          : "Formalize structure and documentation",
      recommendedModule:
        stage === "visitor"
          ? "Income Protection Basics"
          : "Foundational Business Structure",
      upsellLevel: stage === "converter" ? "Foundation" : undefined,
    };
  }

  if (region === "US") {
    return {
      region,
      userStage: stage,
      recommendedAction:
        stage === "visitor"
          ? "Select one system to optimize"
          : stage === "engaged"
          ? "Measure and remove inefficiencies"
          : "Scale with systems and delegation",
      recommendedModule:
        stage === "visitor"
          ? "Systems Thinking"
          : "Scale Architecture",
      upsellLevel: stage === "converter" ? "Visionary" : undefined,
    };
  }

  // Default fallback (EU / MENA)
  return {
    region,
    userStage: stage,
    recommendedAction: "Stabilize → Structure → Expand",
    recommendedModule: "Foundations",
  };
}
