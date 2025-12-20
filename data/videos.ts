// data/videos.ts
export type Region = "us" | "africa" | "latam" | "asia" | "global";
export type Level = 1 | 2 | 3 | 4 | 5;

export type VideoItem = {
  id: string;
  title: string;
  summary: string;
  level: Level;
  regions: Region[]; // if includes "global", treat as global
  minutes: number;
  tags: string[];
  // Use YouTube or Vimeo embed URL (not share URL)
  // Example: https://www.youtube.com/embed/VIDEO_ID
  embedUrl: string;
  // Optional thumbnail URL. If blank, UI will render a placeholder.
  thumbnailUrl?: string;
  // Optional: publish date as ISO string (YYYY-MM-DD)
  published?: string;
};

export const videos: VideoItem[] = [
  // =========================
  // LEVEL 1 — Foundation
  // =========================
  {
    id: "l1-structure-before-income",
    title: "Why Structure Beats Income",
    summary:
      "Most people think more money solves money problems. It doesn’t—structure does. This is Level 1 financial literacy framing.",
    level: 1,
    regions: ["global"],
    minutes: 2,
    tags: ["foundation", "structure", "cashflow"],
    embedUrl: "https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID_1",
    thumbnailUrl: "",
    published: "2025-12-20",
  },
  {
    id: "l1-money-leaks",
    title: "The 5 Money Leaks Most People Never Track",
    summary:
      "Where money disappears: friction spending, convenience tax, invisible subscriptions, impulse loops, and lack of categories.",
    level: 1,
    regions: ["us", "global"],
    minutes: 3,
    tags: ["budgeting", "habits", "awareness"],
    embedUrl: "https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID_2",
  },

  // =========================
  // LEVEL 2 — Systems
  // =========================
  {
    id: "l2-basic-personal-kpis",
    title: "Personal KPIs: Track What Actually Changes Your Life",
    summary:
      "If you don't measure it, you can't improve it. We define financial KPIs that matter—without spreadsheets getting messy.",
    level: 2,
    regions: ["global"],
    minutes: 4,
    tags: ["kpi", "systems", "tracking"],
    embedUrl: "https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID_3",
  },

  // =========================
  // LEVEL 3 — Ownership
  // =========================
  {
    id: "l3-ownership-mentality",
    title: "Ownership vs Income: The Shift That Changes Everything",
    summary:
      "Level 3 is when you stop thinking like a worker and start thinking like an owner—assets, control, and durable cashflow.",
    level: 3,
    regions: ["global"],
    minutes: 5,
    tags: ["ownership", "assets", "wealth-building"],
    embedUrl: "https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID_4",
  },

  // =========================
  // LEVEL 4 — Protection
  // =========================
  {
    id: "l4-protection-first",
    title: "Protection Before Profit (Level 4)",
    summary:
      "Protection is not paranoia. It's governance. We explain the mindset and basic structure—without legal advice.",
    level: 4,
    regions: ["us", "global"],
    minutes: 6,
    tags: ["protection", "governance", "risk"],
    embedUrl: "https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID_5",
  },

  // =========================
  // LEVEL 5 — Capital Architecture
  // =========================
  {
    id: "l5-capital-architecture",
    title: "Capital Architecture: Why Systems Beat Hustle",
    summary:
      "Level 5 is the boardroom view: incentives, structure, governance, durability. This is advanced framing content.",
    level: 5,
    regions: ["global"],
    minutes: 7,
    tags: ["capital", "structure", "governance"],
    embedUrl: "https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID_6",
  },
];

export const allRegions: Region[] = ["us", "africa", "latam", "asia", "global"];

export const levelLabels: Record<Level, string> = {
  1: "Level 1 — Foundation",
  2: "Level 2 — Systems",
  3: "Level 3 — Ownership",
  4: "Level 4 — Protection",
  5: "Level 5 — Capital Architecture",
};
