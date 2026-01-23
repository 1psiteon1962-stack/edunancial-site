// FILE: lib/airtable.ts

export function buildKPIRecord(
  data: KPIRequest,
  source: string = "web"
) {
  return {
    fields: {
      ...data,
      Source: source,
    },
  };
}
