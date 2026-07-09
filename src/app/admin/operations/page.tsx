import OperationsDashboard from "@/components/operations/OperationsDashboard";
import { getOperationsDashboardData, LogQuery } from "@/lib/operations";

function normalizeParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function OperationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters: LogQuery = {
    query: normalizeParam(resolvedSearchParams.query),
    severity: (normalizeParam(resolvedSearchParams.severity) as LogQuery["severity"]) ?? "all",
    eventType: (normalizeParam(resolvedSearchParams.eventType) as LogQuery["eventType"]) ?? "all",
  };
  const dashboard = getOperationsDashboardData(filters);

  return <OperationsDashboard dashboard={dashboard} filters={filters} />;
}
