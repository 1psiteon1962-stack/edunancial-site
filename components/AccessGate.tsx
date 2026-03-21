import { ReactNode } from 'react';
import { Plan } from '@/types/plan';

type AccessGateProps = {
  requiredPlan?: Plan;
  children: ReactNode;
};

export default function AccessGate({ requiredPlan, children }: AccessGateProps) {
  // TEMP: replace with real auth logic later
  const userPlan: Plan = 'free';

  const hasAccess =
    !requiredPlan ||
    userPlan === requiredPlan;

  if (!hasAccess) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Upgrade Required</h2>
        <p>This content requires the {requiredPlan} plan.</p>
      </div>
    );
  }

  return <>{children}</>;
}
