export type AgentStatus =
  | "online"
  | "offline"
  | "maintenance"
  | "planned";

export interface AIAgent {

  id: string;

  name: string;

  department: string;

  description: string;

  status: AgentStatus;

  enabled: boolean;

}

export interface AgentRecommendation {

  id: string;

  agentId: string;

  title: string;

  summary: string;

  priority:
    | "low"
    | "medium"
    | "high"
    | "critical";

  createdAt: Date;

}
