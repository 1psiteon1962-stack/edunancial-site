// lib/levels.ts

export type EdunancialLevel = {
  id: 1 | 2 | 3 | 4 | 5
  name: string
  headline: string
  summary: string
  focus: string[]
  signals: string[]
  nextMoves: string[]
}

export const EDUNANCIAL_LEVELS: EdunancialLevel[] = [
  {
    id: 1,
    name: "Level 1 — Survival",
    headline: "Stability first. Cash control before growth.",
    summary:
      "This stage is about protecting the basics: predictable income, fewer emergencies, and a simple system that stops financial bleeding.",
    focus: [
      "Stop surprise expenses from wrecking the month",
      "Create a basic budget that you actually follow",
      "Build a starter emergency buffer",
      "Eliminate high-interest traps"
    ],
    signals: [
      "Bills feel reactive or stressful",
      "Debt payments consume decision-making",
      "No consistent savings habit yet",
      "Income feels fragile"
    ],
    nextMoves: [
      "Track spending weekly (not monthly)",
      "Build a $500–$1,000 emergency buffer",
      "Pay down highest-interest debt first",
      "Automate one small savings transfer"
    ]
  },
  {
    id: 2,
    name: "Level 2 — Lifestyle",
    headline: "You can breathe. Now build consistency.",
    summary:
      "You can cover your needs and some wants. The goal now is repeatability: consistent saving, stable routines, and fewer financial shocks.",
    focus: [
      "Consistent saving and spending rules",
      "Increase income or reduce fixed costs",
      "Improve credit and financial reliability",
      "Start learning basic investing"
    ],
    signals: [
      "You can handle normal expenses",
      "You still get hit by occasional surprise costs",
      "Saving happens, but not automatically",
      "You want to invest but don’t feel confident"
    ],
    nextMoves: [
      "Automate savings and bills",
      "Start a simple index-fund habit (small is fine)",
      "Set a credit improvement plan",
      "Create rules for big purchases"
    ]
  },
  {
    id: 3,
    name: "Level 3 — Wealth-Building",
    headline: "Systems + assets. Money starts working.",
    summary:
      "You’re building assets consistently. This stage is about disciplined investing, protecting capital, and expanding income streams.",
    focus: [
      "Asset allocation and risk management",
      "Consistent investing contributions",
      "Side income or scalable skills",
      "Basic tax awareness"
    ],
    signals: [
      "You invest regularly (even modestly)",
      "You think in timelines (1–5 years)",
      "You track net worth",
      "You avoid emotional money decisions"
    ],
    nextMoves: [
      "Increase contributions with each income bump",
      "Formalize your investing plan (rules-based)",
      "Add an income stream tied to skills or distribution",
      "Start tracking taxes and deductions"
    ]
  },
  {
    id: 4,
    name: "Level 4 — Empire Builder",
    headline: "Structure wins. Teams, leverage, and scale.",
    summary:
      "This stage is about business systems, legal/operational structure, and scaling with discipline. You build organizations, not just income.",
    focus: [
      "Business systems and SOPs",
      "Delegation and team building",
      "Legal structure and compliance mindset",
      "Scaling distribution and partnerships"
    ],
    signals: [
      "You think in processes, not hustle",
      "You document and delegate",
      "You track KPIs",
      "You protect downside risk"
    ],
    nextMoves: [
      "Build repeatable acquisition + delivery processes",
      "Create a KPI dashboard",
      "Strengthen contracts and operating structure",
      "Recruit for key roles (ops, sales, finance)"
    ]
  },
  {
    id: 5,
    name: "Level 5 — Capital Architect",
    headline: "You design capital. You own the game.",
    summary:
      "You structure deals, raise capital, and control assets through smart ownership, governance, and long-horizon strategy.",
    focus: [
      "Capital stack and fundraising strategy",
      "Governance, ownership, and control",
      "Portfolio design across markets",
      "Institutional-level risk controls"
    ],
    signals: [
      "You evaluate opportunities by structure, not hype",
      "You understand equity, debt, and investor expectations",
      "You build durable organizations and assets",
      "You optimize for decades, not months"
    ],
    nextMoves: [
      "Design an investor-ready narrative and documentation",
      "Develop repeatable due diligence checklists",
      "Build partnerships with capital sources",
      "Create governance that survives growth"
    ]
  }
]

// Optional convenience exports if other files expect them
export const EDUNANCIAL_LEVELS_BY_ID = Object.fromEntries(
  EDUNANCIAL_LEVELS.map((l) => [l.id, l])
) as Record<EdunancialLevel["id"], EdunancialLevel>

export function getEdunancialLevel(id: EdunancialLevel["id"]) {
  return EDUNANCIAL_LEVELS_BY_ID[id]
}
