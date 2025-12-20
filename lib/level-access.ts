export type Level = 1 | 2 | 3 | 4 | 5;

export type AccessRule = {
  level: Level;
  label: string;
  description: string;
  isPublic: boolean;
};

export const LEVEL_ACCESS: AccessRule[] = [
  {
    level: 1,
    label: "Foundation",
    description: "Financial awareness and discipline",
    isPublic: true,
  },
  {
    level: 2,
    label: "Structure",
    description: "Business and income structure",
    isPublic: true,
  },
  {
    level: 3,
    label: "Ownership",
    description: "Assets, entities, protection",
    isPublic: false,
  },
  {
    level: 4,
    label: "Scale",
    description: "Capital leverage and expansion",
    isPublic: false,
  },
  {
    level: 5,
    label: "Capital Architect",
    description: "Governance, systems, legacy",
    isPublic: false,
  },
];

export function isLevelAccessible(level: Level, hasAccess: boolean) {
  const rule = LEVEL_ACCESS.find(r => r.level === level);
  if (!rule) return false;
  if (rule.isPublic) return true;
  return hasAccess;
}
