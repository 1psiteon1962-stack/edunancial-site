export type LevelDefinition = {
  id: string;
  title: string;
  description?: string;
  requires?: "starter" | "pro" | "premium" | "enterprise";
};
