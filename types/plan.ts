export type PlanCode =
  | "free"
  | "starter"
  | "founder"
  | "pro"
  | "elite"

export type Plan = {
  code: PlanCode
  name: string
  label: string
  description: string
  rank: number
}

export const PLANS: Record<PlanCode, Plan> = {
  free: {
    code: "free",
    name: "Free",
    label: "Free",
    description: "Basic access",
    rank: 0
  },
  starter: {
    code: "starter",
    name: "Starter",
    label: "Starter",
    description: "Entry level business tools",
    rank: 1
  },
  founder: {
    code: "founder",
    name: "Founder",
    label: "Founder",
    description: "Corporate & compliance systems",
    rank: 2
  },
  pro: {
    code: "pro",
    name: "Pro",
    label: "Professional",
    description: "Global expansion tools",
    rank: 3
  },
  elite: {
    code: "elite",
    name: "Elite",
    label: "Elite",
    description: "Capital, deal flow, private intelligence",
    rank: 4
  }
}

export const DEFAULT_PLAN: PlanCode = "free"

export function isPlanCode(value: any): value is PlanCode {
  return value in PLANS
}

export function hasAccess(userPlan: PlanCode, required: PlanCode): boolean {
  return PLANS[userPlan].rank >= PLANS[required].rank
}
