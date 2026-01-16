"use client"

import { ReactNode } from "react"
import { PlanCode, PLANS, DEFAULT_PLAN, hasAccess } from "@/types/plan"
import Link from "next/link"

export default function AccessGate({
  required,
  userPlan = DEFAULT_PLAN,
  children
}: {
  required: PlanCode
  userPlan?: PlanCode
  children: ReactNode
}) {
  if (hasAccess(userPlan, required)) {
    return <>{children}</>
  }

  const requiredPlan = PLANS[required]

  return (
    <div style={{ padding: 40, textAlign: "center", border: "1px solid #ccc" }}>
      <h2>Upgrade Required</h2>
      <p>
        This section requires the <strong>{requiredPlan.label}</strong> plan.
      </p>
      <p style={{ opacity: 0.8 }}>{requiredPlan.description}</p>

      <Link href="/pricing">
        <button style={{ marginTop: 20, padding: "12px 24px", fontWeight: 700 }}>
          Upgrade Now
        </button>
      </Link>
    </div>
  )
}
