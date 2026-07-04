export interface AgentReport {

  id: string;

  agentId: string;

  title: string;

  createdAt: Date;

  summary: string;

}

export const reports: AgentReport[] = [];
