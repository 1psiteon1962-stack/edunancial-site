// components/LevelGate.tsx
import { Level, LEVEL_LABELS } from "@/lib/levels";
import { hasAccess } from "@/lib/access-control";
import { getUserLevel } from "@/lib/user-session";
import PaymentSection from "./PaymentSection";

type Props = {
  requiredLevel: Level;
  children: React.ReactNode;
  region: string;
};

export default function LevelGate({
  requiredLevel,
  children,
  region
}: Props) {
  const userLevel = getUserLevel();

  if (hasAccess(userLevel, { requiredLevel })) {
    return <>{children}</>;
  }

  return (
    <section
      style={{
        border: "2px dashed #999",
        padding: "2rem",
        marginTop: "2rem",
        background: "#fafafa"
      }}
    >
      <h3>Locked Content</h3>
      <p>
        This section requires <strong>Level {requiredLevel}</strong> —{" "}
        {LEVEL_LABELS[requiredLevel]}.
      </p>

      <p>Your current level: Level {userLevel}</p>

      <PaymentSection region={region} />
    </section>
  );
}
