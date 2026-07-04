export interface AgentTask {

  id: string;

  agentId: string;

  title: string;

  completed: boolean;

}

export const defaultTasks: AgentTask[] = [];
