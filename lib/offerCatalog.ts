import { Region } from "@/lib/core";

export type Offer = {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  type: "content" | "tool" | "membership" | "action";
  regions: Region[];
};

export const OFFER_CATALOG: Offer[] = [
  {
    id: "starter-discipline",
    title: "Discipline Foundations",
    description: "Structured framework for habit, capital discipline, and execution.",
    priceUSD: 4.99,
    type: "content",
    regions: ["US", "LATAM"],
  },
  {
    id: "action-business-kit",
    title: "Immediate Income Business Kit",
    description: "Action-first frameworks to generate income within 30–60 days.",
    priceUSD: 4.99,
    type: "action",
    regions: ["AFRICA"],
  },
  {
    id: "metrics-dashboard",
    title: "Personal Metrics Dashboard",
    description: "Track progress, behavior, and financial discipline over time.",
    priceUSD: 9.99,
    type: "tool",
    regions: ["US", "LATAM", "AFRICA"],
  },
  {
    id: "membership-core",
    title: "Edunancial Core Membership",
    description: "Access to structured systems, tools, and decision frameworks.",
    priceUSD: 9.99,
    type: "membership",
    regions: ["US", "LATAM"],
  },
];
