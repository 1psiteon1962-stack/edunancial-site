import { notFound } from "next/navigation";
import { isValidRegion } from "@/lib/regions/regionRegistry";

export default function RegionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { region: string };
}) {
  if (!isValidRegion(params.region)) {
    notFound();
  }

  return <>{children}</>;
}
