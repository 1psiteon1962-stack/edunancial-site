'use client'

import React from 'react'

/**
 * FULL PLAN LADDER (FINALIZED)
 */
export type Plan =
  | 'free'
  | 'starter'
  | 'basic'
  | 'growth'
  | 'pro'
  | 'enterprise'
  | 'elite'

/**
 * PLAN RANKING (ORDER MATTERS)
 */
const PLAN_RANK: Record<Plan, number> = {
  free: 0,
  starter: 1,
  basic: 2,
  growth: 3,
  pro: 4,
  enterprise: 5,
  elite: 6,
}

/**
 * Props
 */
export type AccessGateProps = {
  children: React.ReactNode
  requiredPlan?: Plan
  requiredLevel?: number
  userPlan?: Plan
}

/**
 * Normalize plan safely
 */
function normalizePlan(plan?: string): Plan {
  const normalized = (plan || 'free').toLowerCase()

  if (
    normalized === 'free' ||
    normalized === 'starter' ||
    normalized === 'basic' ||
    normalized === 'growth' ||
    normalized === 'pro' ||
    normalized === 'enterprise' ||
    normalized === 'elite'
  ) {
    return normalized
  }

  return 'free'
}

/**
 * Access logic
 */
export default function AccessGate({
  children,
  requiredPlan,
  requiredLevel,
  userPlan,
}: AccessGateProps) {
  const normalizedUserPlan = normalizePlan(userPlan)
  const userLevel = PLAN_RANK[normalizedUserPlan]

  let allowed = false

  // Plan-based logic
  if (requiredPlan) {
    const requiredLevelFromPlan = PLAN_RANK[requiredPlan]
    allowed = userLevel >= requiredLevelFromPlan
  }

  // Level-based override
  if (typeof requiredLevel === 'number') {
    allowed = userLevel >= requiredLevel
  }

  if (!allowed) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Access Restricted</h2>
        <p>You need a higher plan to access this content.</p>
      </div>
    )
  }

  return <>{children}</>
}
