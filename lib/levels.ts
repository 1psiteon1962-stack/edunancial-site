// lib/levels.ts

export type EdunancialLevel = {
  level: 1 | 2 | 3 | 4 | 5
  title: string
  headline: string
  summary: string
  focus: string[]
  signals: string[]
  nextMoves: string[]
}

export const EDUNANCIAL_LEVELS: EdunancialLevel[] = [
  {
    level: 1,
    title: "Survival",
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
    level: 2,
    title: "Lifestyle",
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
    level: 3,
    title: "Wealth-Building",
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
      "You invest regularly",
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
    level: 4,
    title: "Empire Builder",
    headline: "Structure wins. Teams, leverage, and scale.",
    summary:
      "This stage is about business systems, legal structure, and scaling with discipline. You build organizations, not just income.",
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
      "Build repeatable acquisition + delivery systems",
      "Create a KPI dashboard",
      "Strengthen contracts and structure",
      "Recruit for key operational roles"
    ]
  },
  {
    level: 5,
    title: "Capital Architect",
    headline: "You design capital. You own the game.",
    summary:
      "You structure deals, raise capital, and control assets through governance, ownership, and long-horizon strategy.",
    focus: [
      "Capital stack design",
      "Fundraising and investor alignment",
      "Portfolio construction",
      "Institutional risk management"
    ],
    signals: [
      "You evaluate structure before opportunity",
      "You understand equity and control",
      "You design governance intentionally",
      "You optimize for decades, not months"
    ],
    nextMoves: [
      "Build investor-ready documentation",
      "Design repeatable diligence frameworks",
      "Develop capital partnerships",
      "Create governance that survives scale"
    ]
  }
]

// Convenience helpers
export const EDUNANCIAL_LEVELS_BY_LEVEL = Object.fromEntries(
  EDUNANCIAL_LEVELS.map((l) => [l.level, l])
) as Record<EdunancialLevel["level"], EdunancialLevel>

export function getEdunancialLevel(level: EdunancialLevel["level"]) {
  return EDUNANCIAL_LEVELS_BY_LEVEL[level]
}
