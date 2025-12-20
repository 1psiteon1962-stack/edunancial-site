// data/levels.ts
// This file defines literacy readiness levels.
// Levels are enforced platform-wide.

export type LiteracyLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface LevelDefinition {
  level: LiteracyLevel;
  name: string;
  description: string;
  allowedApps: string[];
  allowedPurchases: string[];
  capitalAccess: boolean;
}

export const Levels: Record<LiteracyLevel, LevelDefinition> = {
  0: {
    level: 0,
    name: "Observer",
    description: "Browsing only. No transactions.",
    allowedApps: [],
    allowedPurchases: [],
    capitalAccess: false,
  },
  1: {
    level: 1,
    name: "Foundational",
    description: "Basic financial literacy.",
    allowedApps: ["EduReadiness"],
    allowedPurchases: ["starter-guides"],
    capitalAccess: false,
  },
  2: {
    level: 2,
    name: "Participant",
    description: "Understands money, risk, and structure.",
    allowedApps: ["EduReadiness", "EduMath"],
    allowedPurchases: ["courses", "workshops"],
    capitalAccess: false,
  },
  3: {
    level: 3,
    name: "Builder",
    description: "Can model outcomes and scenarios.",
    allowedApps: ["EduReadiness", "EduMath", "EduVesting"],
    allowedPurchases: ["advanced-tools", "memberships"],
    capitalAccess: false,
  },
  4: {
    level: 4,
    name: "Investor-Ready",
    description: "Prepared for structured capital exposure.",
    allowedApps: ["EduReadiness", "EduMath", "EduVesting"],
    allowedPurchases: ["deal-access", "private-briefings"],
    capitalAccess: true,
  },
  5: {
    level: 5,
    name: "Operator",
    description: "Advanced capital structuring and deployment.",
    allowedApps: ["ALL"],
    allowedPurchases: ["everything"],
    capitalAccess: true,
  },
};
