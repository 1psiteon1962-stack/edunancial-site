'use client'

import React from 'react'

/**
 * Centralized plan definition
 * This FIXES:
 * - Missing export "Plan"
 * - Type mismatch across the app
 */
export type Plan = 'free' | 'basic' | 'pro' | 'enterprise' | 'elite'

export type AccessGateProps = {
  children: React.ReactNode
  requiredPlan: Plan
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
  userPlan,
}: AccessGateProps) {
  const normalizedUserPlan = normalizePlan(userPlan)

  const allowed =
    normalizedUserPlan === requiredPlan ||
    normalizedUserPlan === 'elite' ||
    normalizedUserPlan === 'enterprise'

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
