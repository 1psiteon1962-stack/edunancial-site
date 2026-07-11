import { CompetencyLevel } from "@/lib/competency/types";
import { getLevelDefinition } from "@/lib/competency/levels";

interface Props {
  level: CompetencyLevel;
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function CompetencyLevelBadge({ level, score, size = "md" }: Props) {
  const def = getLevelDefinition(score);

  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-lg font-black",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-bold ${def.bgColor} ${def.textColor} ${sizeClasses[size]}`}
    >
      <span>{def.badgeEmoji}</span>
      <span>{level}</span>
    </span>
  );
}
