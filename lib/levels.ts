export type LevelId =
  | "free"
  | "starter"
  | "builder"
  | "operator"
  | "owner"
  | "investor";

export interface Level {
  id: LevelId;
  title: string;
  description: string;
}

export const EDUNANCIAL_LEVELS: Level[] = [
  {
    id: "free",
    title: "Free",
    description: "Basic access to foundational content",
  },
  {
    id: "starter",
    title: "Starter",
    description: "Entry-level tools and learning",
  },
  {
    id: "builder",
    title: "Builder",
    description: "Intermediate systems and execution",
  },
  {
    id: "operator",
    title: "Operator",
    description: "Advanced operational frameworks",
  },
  {
    id: "owner",
    title: "Owner",
    description: "Ownership-level strategy and scaling",
  },
  {
    id: "investor",
    title: "Investor",
    description: "Capital deployment and high-level strategy",
  },
];
