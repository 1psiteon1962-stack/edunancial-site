// ======================================================
// EDUNANCIAL NORTH AMERICA STAGE 1 LAUNCH CONFIGURATION
// FILE 1101
// VERSION 1.0
// ======================================================

export type LaunchPriority = "critical" | "high" | "medium" | "deferred";

export type StageOneFeature = {
  id: string;
  name: string;
  priority: LaunchPriority;
  owner: "platform" | "learning" | "revenue" | "security" | "marketing" | "admin";
  launchRequired: boolean;
  description: string;
};

export const NORTH_AMERICA_MARKETS = [
  "United States",
  "Canada",
  "Puerto Rico",
  "U.S. Virgin Islands",
  "Guam",
] as const;

export const STAGE_ONE_FEATURES: StageOneFeature[] = [
  {
    id: "public-site",
    name: "North America public website",
    priority: "critical",
    owner: "platform",
    launchRequired: true,
    description:
      "Professional public website explaining Edunancial, financial literacy, financial competency, memberships, courses, and customer outcomes.",
  },
  {
    id: "student-dashboard",
    name: "Student dashboard",
    priority: "critical",
    owner: "learning",
    launchRequired: true,
    description:
      "Member dashboard showing learning path, competency score, progress, certificates, downloads, recommendations, and next actions.",
  },
  {
    id: "course-engine",
    name: "Course and lesson engine",
    priority: "critical",
    owner: "learning",
    launchRequired: true,
    description:
      "Reusable course, module, lesson, quiz, certificate, and progress data model for financial education products.",
  },
  {
    id: "subscription-products",
    name: "Subscription products",
    priority: "critical",
    owner: "revenue",
    launchRequired: true,
    description:
      "Individual, family, premium, and business membership plan definitions for monetization and checkout integration.",
  },
  {
    id: "admin-command-center",
    name: "Admin command center",
    priority: "high",
    owner: "admin",
    launchRequired: true,
    description:
      "Admin overview for users, content, subscriptions, revenue, support, and launch readiness.",
  },
  {
    id: "seo-ai-discovery",
    name: "SEO and AI discovery framework",
    priority: "high",
    owner: "marketing",
    launchRequired: true,
    description:
      "Metadata, structured content, blog topics, and AI-readable positioning to help search engines and AI systems understand Edunancial.",
  },
  {
    id: "security-privacy",
    name: "Security and privacy baseline",
    priority: "critical",
    owner: "security",
    launchRequired: true,
    description:
      "Privacy, terms, role permissions, safe defaults, data minimization, and launch security requirements.",
  },
];

export function getLaunchRequiredFeatures() {
  return STAGE_ONE_FEATURES.filter((feature) => feature.launchRequired);
}

export function getCriticalLaunchFeatures() {
  return STAGE_ONE_FEATURES.filter((feature) => feature.priority === "critical");
}

export function getFeaturesByOwner(owner: StageOneFeature["owner"]) {
  return STAGE_ONE_FEATURES.filter((feature) => feature.owner === owner);
}
