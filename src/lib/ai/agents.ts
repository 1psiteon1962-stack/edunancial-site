export type AgentStatus =
  | "enabled"
  | "disabled";

export interface AIAgent {

  id: string;

  name: string;

  description: string;

  schedule:
    | "manual"
    | "hourly"
    | "daily"
    | "weekly";

  status: AgentStatus;

}

export const aiAgents: AIAgent[] = [

  {
    id: "research",
    name: "Research Agent",
    description:
      "Researches economics, financial systems, regulations and education worldwide.",
    schedule: "daily",
    status: "enabled",
  },

  {
    id: "localization",
    name: "Localization Agent",
    description:
      "Adapts examples and content for each country.",
    schedule: "manual",
    status: "enabled",
  },

  {
    id: "compliance",
    name: "Compliance Agent",
    description:
      "Checks content before publication.",
    schedule: "manual",
    status: "enabled",
  },

  {
    id: "marketing",
    name: "Marketing Agent",
    description:
      "Creates marketing campaigns and social content.",
    schedule: "daily",
    status: "enabled",
  },

  {
    id: "marketplace",
    name: "Marketplace Agent",
    description:
      "Finds professionals for the marketplace.",
    schedule: "daily",
    status: "enabled",
  },

  {
    id: "kpi",
    name: "KPI Agent",
    description:
      "Summarizes platform metrics.",
    schedule: "daily",
    status: "enabled",
  },

  {
    id: "country-readiness",
    name: "Country Readiness Agent",
    description:
      "Evaluates countries before launch.",
    schedule: "weekly",
    status: "enabled",
  },

];
