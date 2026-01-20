export type KPIRecord = {
  key: string;
  value: number;
  timestamp: number;
};

export function buildKPIRecord(
  key: string,
  value: number
): KPIRecord {
  return {
    key,
    value,
    timestamp: Date.now(),
  };
}
