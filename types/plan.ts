export type PlanCode = "free" | "starter" | "builder" | "pro" | "elite"

export type Plan = {
  code: PlanCode
  name: string
  price: number
}

export const PLANS: Record<PlanCode, Plan> = {
  free: { code: "free", name: "Free", price: 0 },
  starter: { code: "starter", name: "Starter", price: 29 },
  builder: { code: "builder", name: "Builder", price: 59 },
  pro: { code: "pro", name: "Pro", price: 99 },
  elite: { code: "elite", name: "Elite", price: 299 }
}

export const DEFAULT_PLAN: PlanCode = "free"

export function isPlanCode(code: any): code is PlanCode {
  return code in PLANS
}

export function hasAccess(userPlan: PlanCode, requiredPlan: PlanCode): boolean {
  const order: PlanCode[] = ["free", "starter", "builder", "pro", "elite"]
  return order.indexOf(userPlan) >= order.indexOf(requiredPlan)
}
