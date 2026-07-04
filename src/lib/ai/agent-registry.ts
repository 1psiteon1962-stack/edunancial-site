import { AIAgent } from "@/types/ai-agents";

export const agentRegistry: AIAgent[] = [

  {
    id: "ceo",

    name: "CEO Agent",

    department: "Executive",

    description:
      "Executive strategy and prioritization.",

    status: "planned",

    enabled: true,
  },

  {
    id: "coo",

    name: "COO Agent",

    department: "Operations",

    description:
      "Business operations and workflow.",

    status: "planned",

    enabled: true,
  },

  {
    id: "cfo",

    name: "CFO Agent",

    department: "Finance",

    description:
      "Revenue, cash flow and forecasting.",

    status: "planned",

    enabled: true,
  },

  {
    id: "cio",

    name: "CIO Agent",

    department: "Technology",

    description:
      "Technology and AI infrastructure.",

    status: "planned",

    enabled: true,
  },

];
