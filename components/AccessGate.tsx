'use client'

import React from 'react'

/**
 * Plan hierarchy (order matters)
 */
export type Plan = 'free' | 'basic' | 'pro' | 'enterprise' | 'elite'

const PLAN_RANK: Record<Plan, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  enterprise: 3,
  elite: 4,
}

/**
 * Props now support BOTH:
 * - requiredPlan (string-based access)
 * - requiredLevel (number-based access)
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
    normalized === 'basic' ||
    normalized === 'pro' ||
    normalized === 'enterprise' ||
    normalized === 'elite'
  ) {
    return normalized
  }

  return 'free'
}

/**
 * Access control logic
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

  // 🔹 Plan-based access
  if (requiredPlan) {
    allowed =
      normalizedUserPlan === requiredPlan ||
      normalizedUserPlan === 'enterprise' ||
      normalizedUserPlan === 'elite'
  }

  // 🔹 Level-based access (overrides if provided)
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
