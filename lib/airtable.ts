// lib/airtable.ts

export type KPIInput = {
  userId: string;
  plan: string;
  createdAt: string;
  lastActiveAt: string;
};

export type KPIRecord = {
  fields: {
    userId: string;
    plan: string;
    createdAt: string;
    lastActiveAt: string;
  };
};

/**
 * Build a clean Airtable-ready KPI record object.
 * This is what the API route expects.
 */
export function buildKPIRecord(input: KPIInput): KPIRecord {
  return {
    fields: {
      userId: input.userId,
      plan: input.plan,
      createdAt: input.createdAt,
      lastActiveAt: input.lastActiveAt,
    },
  };
}
