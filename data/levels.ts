// data/levels.ts
// This file defines literacy readiness levels.
// Levels are enforced platform-wide.

export type LiteracyLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface LevelDefinition {
  level: LiteracyLevel;
  name: string;
  title: string;
  description: string;
  allowedApps: string[];
  allowedPurchases: string[];
  capitalAccess: boolean;
}

export const Levels: Record<LiteracyLevel, LevelDefinition> = {
  0: {
    level: 0,
    name: "Observer",
    title: "Observer",
    description: "Browsing only. No transactions.",
    allowedApps: [],
    allowedPurchases: [],
    capitalAccess: false,
  },
  1: {
    level: 1,
    name: "Foundational",
    title: "Level 1",
    description: "Basic financial literacy.",
    allowedApps: ["EduReadiness"],
    allowedPurchases: ["starter-guides"],
    capitalAccess: false,
  },
  2: {
    level: 2,
    name: "Participant",
    title: "Level 2",
    description: "Understands money, risk, and structure.",
    allowedApps: ["EduReadiness", "EduMath"],
    allowedPurchases: ["courses", "workshops"],
    capitalAccess: false,
  },
  3: {
    level: 3,
    name: "Builder",
    title: "Level 3",
    description: "Can model outcomes and scenarios.",
    allowedApps: ["EduReadiness", "EduMath"],
    allowedPurchases: ["advanced-tools", "memberships"],
    capitalAccess: false,
  },
  4: {
    level: 4,
    name: "Investor-Ready",
    title: "Level 4",
    description: "Prepared for structured capital.",
    allowedApps: ["EduReadiness", "EduMath"],
    allowedPurchases: ["deal-access", "private-briefings"],
    capitalAccess: true,
  },
  5: {
    level: 5,
    name: "Operator",
    title: "Level 5",
    description: "Advanced capital structuring and execution.",
    allowedApps: ["ALL"],
    allowedPurchases: ["everything"],
    capitalAccess: true,
  },
};
