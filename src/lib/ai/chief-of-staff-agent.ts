export interface ExecutiveTask {

  priority:
    | "critical"
    | "high"
    | "medium"
    | "low";

  title: string;

  assignedAgent: string;

}

export function getExecutiveTasks(): ExecutiveTask[] {

  return [

    {

      priority: "high",

      title: "Complete Membership Platform",

      assignedAgent: "CEO Agent",

    },

    {

      priority: "high",

      title: "Finish Square Payment Integration",

      assignedAgent: "CFO Agent",

    },

    {

      priority: "medium",

      title: "Continue AI Communications Center",

      assignedAgent: "COO Agent",

    },

    {

      priority: "medium",

      title: "Expand Global Marketplace",

      assignedAgent: "Marketing Agent",

    },

  ];

}
