// lib/levels.ts

export type EdunancialLevel = {
  level: 1 | 2 | 3 | 4 | 5
  title: string
  audience: string
  access: string
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
    audience: "Individuals stabilizing income and expenses",
    access: "Free",
    headline: "Stability before growth.",
    summary:
      "This stage focuses on stopping financial bleeding and creating basic predictability. The priority is control, not expansion.",
    focus: [
      "Cash flow awareness",
      "Emergency buffering",
      "Debt containment",
      "Expense discipline"
    ],
    signals: [
      "Bills feel reactive",
      "Little to no savings",
      "High-interest debt pressure",
      "Income fragility"
    ],
    nextMoves: [
      "Track spending weekly",
      "Build a starter emergency fund",
      "Reduce high-interest liabilities",
      "Create one automated savings habit"
    ]
  },
  {
    level: 2,
    title: "Lifestyle",
    audience: "Individuals with stable income seeking consistency",
    access: "Free / Entry",
    headline: "Consistency replaces chaos.",
    summary:
      "Expenses are covered and habits are forming. This level is about repeatability, reliability, and reducing volatility.",
    focus: [
      "Savings automation",
      "Credit strengthening",
      "Basic investing literacy",
      "Lifestyle cost control"
    ],
    signals: [
      "Monthly bills are manageable",
      "Savings exists but isn’t systematized",
      "Occasional financial surprises",
      "Interest in investing"
    ],
    nextMoves: [
      "Automate savings and bills",
      "Establish credit improvement targets",
      "Begin low-risk investing",
      "Create spending rules"
    ]
  },
  {
    level: 3,
    title: "Wealth-Building",
    audience: "Investors and professionals building assets",
    access: "Paid",
    headline: "Money starts working.",
    summary:
      "Assets are accumulated with intent. The focus is disciplined investing, income expansion, and downside protection.",
    focus: [
      "Asset allocation",
      "Risk management",
      "Multiple income streams",
      "Tax awareness"
    ],
    signals: [
      "Regular investing behavior",
      "Net worth tracking",
      "Long-term thinking",
      "Rules-based decisions"
    ],
    nextMoves: [
      "Increase contribution rates",
      "Formalize an investment thesis",
      "Add scalable income streams",
      "Optimize tax positioning"
    ]
  },
  {
    level: 4,
    title: "Empire Builder",
    audience: "Founders and operators scaling organizations",
    access: "Premium",
    headline: "Structure replaces hustle.",
    summary:
      "Growth comes from systems, teams, and leverage. Risk management and governance become essential.",
    focus: [
      "Operational systems",
      "Delegation",
      "Legal structure",
      "KPI discipline"
    ],
    signals: [
      "Process-driven execution",
      "Team reliance",
      "Documented operations",
      "Risk-aware scaling"
    ],
    nextMoves: [
      "Build SOPs",
      "Install KPI dashboards",
      "Strengthen contracts and compliance",
      "Recruit operational leadership"
    ]
  },
  {
    level: 5,
    title: "Capital Architect",
    audience: "Investors, fund builders, capital allocators",
    access: "Invite / Institutional",
    headline: "You design capital itself.",
    summary:
      "At this level, capital structures, governance, and long-horizon strategy define success.",
    focus: [
      "Capital stack design",
      "Investor alignment",
      "Portfolio construction",
      "Governance architecture"
    ],
    signals: [
      "Structure-first thinking",
      "Equity control awareness",
      "Institutional mindset",
      "Decade-long planning"
    ],
    nextMoves: [
      "Design capital vehicles",
      "Prepare investor-grade documentation",
      "Build governance frameworks",
      "Expand strategic partnerships"
    ]
  }
]

// Lookup helpers
export const EDUNANCIAL_LEVELS_BY_LEVEL = Object.fromEntries(
  EDUNANCIAL_LEVELS.map((l) => [l.level, l])
) as Record<EdunancialLevel["level"], EdunancialLevel>

export function getEdunancialLevel(level: EdunancialLevel["level"]) {
  return EDUNANCIAL_LEVELS_BY_LEVEL[level]
}
