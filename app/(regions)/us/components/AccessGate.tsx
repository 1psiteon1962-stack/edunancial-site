'use client'

import React from 'react'
import { normalizePlan, type PlanCode } from '@/app/lib/plans'

export type AccessGateProps = {
  children: React.ReactNode
  requiredPlan: PlanCode
  userPlan?: string | null
}

export default function AccessGate({
  children,
  requiredPlan,
  userPlan
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
        <p>You do not have access to this content.</p>
      </div>
    )
  }

  return <>{children}</>
}
