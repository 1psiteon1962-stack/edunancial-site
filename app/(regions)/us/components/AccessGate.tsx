import { ReactNode } from "react";
import { PLANS, PlanCode } from "../../../../types/plan";

type AccessGateProps = {
  required: PlanCode;
  children: ReactNode;
  userPlan?: PlanCode;
};

export default function AccessGate({ required, children, userPlan = "free" }: AccessGateProps) {
  const order = Object.keys(PLANS) as PlanCode[];
  const userLevel = order.indexOf(userPlan);
  const requiredLevel = order.indexOf(required);

  if (userLevel >= requiredLevel) return <>{children}</>;

  return (
    <div
      style={{
        border: "2px solid #111",
        padding: 24,
        borderRadius: 12,
        background: "#fafafa",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Upgrade Required</h2>
      <p style={{ marginBottom: 0 }}>
        This section requires the <strong>{PLANS[required].label}</strong> plan.
      </p>

      <a
        href="/us/pay"
        style={{
          display: "inline-block",
          marginTop: 16,
          padding: "10px 18px",
          background: "#111",
          color: "white",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        Upgrade Now
      </a>
    </div>
  );
}
