import type { LevelSpec } from "../../types/level";

export const US_LEVELS: LevelSpec[] = [
  {
    code: "L1",
    title: "Level 1 — Start Clean",
    tagline: "From idea to first dollars with structure, not chaos.",
    recommendedPlan: "free",
    outcomes: [
      "Choose a business model that matches your capital reality",
      "Set up basic structure: name, offer, niche, positioning",
      "Avoid common beginner traps (pricing, scope creep, random tools)",
    ],
    modules: [
      {
        title: "Business Reality Check",
        bullets: [
          "Capital: what you have vs what the model demands",
          "Risk: identify, limit, hedge (structure is a hedge)",
          "Time: build a weekly execution plan you can actually follow",
        ],
      },
      {
        title: "Foundation Setup",
        bullets: [
          "Define your offer (what you sell) and who you sell to",
          "Simple pricing ladder (entry → core → premium)",
          "Core workflows: sales, delivery, customer support",
        ],
      },
      {
        title: "Protection Basics (Early, Not Later)",
        bullets: [
          "Brand/IP basics: trademarks, copyrights, contracts",
          "Cyber basics: passwords, MFA, backups, least privilege",
          "Simple compliance habits: documentation, receipts, policies",
        ],
      },
    ],
    nextPath: { label: "Go to Level 2", href: "/us/level-2" },
  },
  {
    code: "L2",
    title: "Level 2 — Operate",
    tagline: "Build repeatable systems and stop relying on luck.",
    recommendedPlan: "starter",
    outcomes: [
      "Create repeatable workflows for marketing, sales, delivery",
      "Build a basic KPI system that shows what works",
      "Reduce risk with templates, checklists, and documented processes",
    ],
    modules: [
      {
        title: "Operations & Execution",
        bullets: [
          "Weekly execution cadence (targets, actions, review)",
          "Standard Operating Procedures (SOPs) that scale",
          "Simple client/customer lifecycle",
        ],
      },
      {
        title: "KPI System (Proof, Not Hope)",
        bullets: [
          "Leads → conversions → revenue",
          "Churn and retention basics",
          "Unit economics (even for small founders)",
        ],
      },
      {
        title: "Security & IP (Operational)",
        bullets: [
          "Data handling and privacy habits",
          "Vendor risk and access control",
          "IP checklists and brand monitoring",
        ],
      },
    ],
    nextPath: { label: "Go to Level 3", href: "/us/level-3" },
  },
  {
    code: "L3",
    title: "Level 3 — Scale",
    tagline: "Build a machine: predictable acquisition, delivery, retention.",
    recommendedPlan: "pro",
    outcomes: [
      "Install a growth model that can run weekly",
      "Upgrade your analytics and forecasting",
      "Create support layers so the business isn’t dependent on you",
    ],
    modules: [
      {
        title: "Growth Engine",
        bullets: [
          "Acquisition channels: pick 1–2 and go deep",
          "Offers and conversion optimization",
          "Retention systems: upsells, onboarding, community",
        ],
      },
      {
        title: "Financial Structure",
        bullets: [
          "Cash flow planning",
          "Margin improvement",
          "Pricing tests and packaging",
        ],
      },
      {
        title: "Risk & Compliance",
        bullets: [
          "Contract discipline and audit trails",
          "Security posture improvements",
          "Vendor + partner due diligence basics",
        ],
      },
    ],
    nextPath: { label: "Go to Level 4", href: "/us/level-4" },
  },
  {
    code: "L4",
    title: "Level 4 — Capital Ready",
    tagline: "Investor-grade discipline: governance, metrics, defensibility.",
    recommendedPlan: "elite",
    outcomes: [
      "Become diligence-ready (documents, KPIs, controls)",
      "Build governance habits that serious capital expects",
      "Design a fundraising story that matches your actual traction",
    ],
    modules: [
      {
        title: "Investor Readiness",
        bullets: [
          "KPI packages and board-style reporting",
          "Cohorts, retention, CAC/LTV, payback periods",
          "Data room mindset (organized evidence)",
        ],
      },
      {
        title: "Governance & Controls",
        bullets: [
          "Basic internal controls",
          "Policy discipline (security, privacy, HR basics)",
          "Vendor and affiliate agreements",
        ],
      },
      {
        title: "Defensibility",
        bullets: [
          "IP strategy and brand protection",
          "Distribution advantages",
          "Network effects and partnerships",
        ],
      },
    ],
    nextPath: { label: "Go to Level 5", href: "/us/level-5" },
  },
  {
    code: "L5",
    title: "Level 5 — Global Capital Architect",
    tagline: "Multi-market strategy, structure, and scale with discipline.",
    recommendedPlan: "elite",
    outcomes: [
      "Design multi-region playbooks (US → LATAM → others)",
      "Structure affiliates and partnerships with compliance in mind",
      "Build global reporting so performance is provable by region",
    ],
    modules: [
      {
        title: "Global Expansion Systems",
        bullets: [
          "Regional differences: pricing, language, compliance",
          "Affiliate and partner strategy",
          "Country/region segmentation and reporting",
        ],
      },
      {
        title: "Structure as Risk Control",
        bullets: [
          "Legal/IP frameworks to reduce theft and disputes",
          "Security maturity across markets",
          "Operational resilience (don’t depend on one state/one law/one vendor)",
        ],
      },
      {
        title: "Capital Strategy",
        bullets: [
          "Funding stages and right-fit capital",
          "Governance for credibility",
          "Investor communications discipline",
        ],
      },
    ],
    nextPath: { label: "Back to US Home", href: "/us" },
  },
];
