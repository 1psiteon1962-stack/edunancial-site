export function buildKPIRecord(
  data: any,
  source: string = "web"
) {
  return {
    ...data,
    Source: source,
  };
}
