export type KPIRecord = {
  key: string;
  value: number;
};

export function buildKPIRecord(input: unknown): KPIRecord {
  return {
    key: "default",
    value: 0,
  };
}
