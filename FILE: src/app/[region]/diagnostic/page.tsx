import DiagnosticFlow from "@/components/diagnostic/DiagnosticFlow";

export default function RegionDiagnosticPage({
  params,
}: {
  params: { region: string };
}) {
  return <DiagnosticFlow regionFromRoute={params.region} />;
}
