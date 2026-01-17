import type { ThinkingLevel } from "@/lib/diagnostic";

type Props = {
  userLevel: ThinkingLevel;
  minimumLevel: ThinkingLevel;
  children: React.ReactNode;
};

export default function LevelGate({
  userLevel,
  minimumLevel,
  children,
}: Props) {
  if (userLevel < minimumLevel) {
    return (
      <div className="border p-4 rounded bg-yellow-50">
        <p className="font-medium">
          This content unlocks at a higher financial thinking level.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
