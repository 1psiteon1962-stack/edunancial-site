import { ReactNode } from "react"
import { PLANS, PlanCode } from "../../../../types/plan"

type AccessGateProps = {
  required: PlanCode
  children: ReactNode
}

export default function AccessGate({ required, children }: AccessGateProps) {
  // TEMPORARY until auth is wired:
  const userPlan: PlanCode = "elite"   // simulate a fully unlocked founder for now

  const allowed = Object.keys(PLANS).indexOf(userPlan) >= Object.keys(PLANS).indexOf(required)

  if (!allowed) {
    return (
      <div style={{ padding: 24, border: "2px solid #cc0000", borderRadius: 12 }}>
        <h3>Upgrade Required</h3>
        <p>
          This section requires the <b>{PLANS[required].label}</b> plan.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
