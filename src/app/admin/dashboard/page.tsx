import { EnterpriseBIPlatform } from "@/components/bi/EnterpriseBIPlatform";
import { getEnterpriseBIData, normalizeReportPeriod } from "@/lib/bi/demo-data";

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const period = normalizeReportPeriod(getSingleValue(resolvedSearchParams?.period));
  const startDate = getSingleValue(resolvedSearchParams?.startDate);
  const endDate = getSingleValue(resolvedSearchParams?.endDate);
  const data = getEnterpriseBIData(period, startDate, endDate);

  return (
    <EnterpriseBIPlatform
      data={data}
      activePeriod={period}
      startDate={startDate}
      endDate={endDate}
    />
  );
}
