import { PLAN_LABELS, getPlanByLevel } from "@/app/types/plan";

export default function AccessGate({ level }: { level: number }) {
  const plan = getPlanByLevel(level);

  if (!plan) {
    return <div>Invalid access level</div>;
  }

  return (
    <div className="border p-4 rounded bg-gray-100">
      <h2 className="font-bold">Locked Content</h2>
      <p>
        You are viewing content for <strong>{PLAN_LABELS[level]}</strong>.
      </p>
      <p>Upgrade to unlock: {plan.name}</p>
    </div>
  );
}
