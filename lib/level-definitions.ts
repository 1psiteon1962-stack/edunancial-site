// lib/level-definitions.ts

export interface LevelDefinition {
  code: string;
  name: string;
  description: string;
}

export const LEVEL_DEFINITIONS: Record<string, LevelDefinition> = {
  starter: {
    code: "starter",
    name: "Starter Level",
    description: "Entry-level tools for new entrepreneurs and investors.",
  },

  builder: {
    code: "builder",
    name: "Builder Level",
    description: "Intermediate systems for business growth and execution.",
  },

  pro: {
    code: "pro",
    name: "Pro Level",
    description: "Advanced monetization, scaling, and operational strategy.",
  },

  elite: {
    code: "elite",
    name: "Elite Level",
    description: "High-level capital structuring and global expansion tools.",
  },

  founder: {
    code: "founder",
    name: "Founder Level",
    description: "Top-tier access for serious founders building empires.",
  },
};
