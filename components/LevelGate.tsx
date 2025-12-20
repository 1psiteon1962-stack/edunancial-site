import { Level, LEVEL_ACCESS, isLevelAccessible } from "@/lib/level-access";

type Props = {
  level: Level;
  children: React.ReactNode;
};

export default function LevelGate({ level, children }: Props) {
  // Placeholder until auth is wired
  const hasAccess = false;

  const rule = LEVEL_ACCESS.find(r => r.level === level);

  if (!rule) {
    return <p>Invalid level.</p>;
  }

  if (!isLevelAccessible(level, hasAccess)) {
    return (
      <div style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}>
        <h3>{rule.label} — Locked</h3>
        <p>{rule.description}</p>
        <p>
          This level requires readiness, structure, and access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
