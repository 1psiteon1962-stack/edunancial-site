export type KPIEvent = {
  id: string
  name: string
  email?: string
  createdAt: string
  event?: string
}

/**
 * Returns CSV string of KPI events
 * Replace with Airtable / DB later
 */
export async function fetchEventsCSV(): Promise<string> {
  const events: KPIEvent[] = [
    {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date().toISOString(),
      event: "signup"
    }
  ]

  const headers = ["id", "name", "email", "createdAt", "event"]

  const rows = events.map(e =>
    [
      e.id,
      e.name,
      e.email ?? "",
      e.createdAt,
      e.event ?? ""
    ].join(",")
  )

  return [headers.join(","), ...rows].join("\n")
}
