export async function fetchAirtable() {
  return []
}

export function buildKPIRecord(data: any) {
  return {
    fields: {
      ...data,
      createdAt: new Date().toISOString()
    }
  }
}
